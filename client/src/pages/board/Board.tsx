import style from './board.module.scss';
import { usePortal } from '../../hooks/usePortal';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Portal } from '../../components/portal/portalModule';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { addNewTask, deleteTask, moveTask } from '../../redux/slices/boardSlice';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { io, type Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadBoard } from '../../redux/thunk/boardThunk';

type ColumnName = 'plan' | 'process' | 'ready';

interface UserInfo {
    id: string;
    name: string;
    room: string;
}

export const Board = () => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const rawJSONUserInfo = localStorage.getItem('userInfo')

    const userInfoJSON = useMemo<UserInfo | null>(() => {
        if (!rawJSONUserInfo) return null
        return JSON.parse(rawJSONUserInfo) as UserInfo
    }, [rawJSONUserInfo])

    useEffect(() => {
        if (!userInfoJSON) {
            navigate('/')
        }
    }, [navigate, userInfoJSON])

    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!userInfoJSON) return

        dispatch(loadBoard(userInfoJSON.room))
    }, [dispatch, userInfoJSON])

    useEffect(() => {
        if (!userInfoJSON) return

        const newSocket = io('http://localhost:3000')
        socketRef.current = newSocket

        newSocket.on('connect', () => {
            newSocket.emit('join_room', { userName: userInfoJSON.name, roomName: userInfoJSON.room })

            newSocket.on('add_task', (data: { roomName: string; taskName: string }) => {
                dispatch(addNewTask(data.taskName))
            })

            newSocket.on('delete_task', (data: { columnName: ColumnName; taskName: string }) => {
                dispatch(deleteTask(data))
            })

            newSocket.on('move_task', (data: {
                fromColumn: ColumnName;
                toColumn: ColumnName;
                fromIndex: number;
                toIndex: number;
            }) => {
                dispatch(moveTask(data))
            })
        })

        return () => {
            newSocket.disconnect()
            socketRef.current = null
        }
    }, [dispatch, userInfoJSON])

    const { isOpen, changePortal } = usePortal()

    const [newTaskName, setNewTaskName] = useState<string>('')

    const { board } = useSelector((state: RootState) => state.board)

    const handlerChangeNewTaskName = (text: string) => {
        setNewTaskName(text)
    }

    const handlerClickToSendNewTask = async () => {
        if (!userInfoJSON) return

        changePortal()
        setNewTaskName('')
        if (newTaskName.trim() !== '') {
            socketRef.current?.emit('add_task', { roomName: userInfoJSON.room, taskName: newTaskName })
            await axios.post('http://localhost:3000/api/tasks/add_task', {
                room_name: userInfoJSON.room,
                title: newTaskName,
                column_name: 'plan',
                position: board.plan.length
            })
            dispatch(addNewTask(newTaskName))
        }
    }

    const handlerClickToDeleteTask = (info: { columnName: ColumnName; taskName: string }) => {
        if (!userInfoJSON) return

        dispatch(deleteTask(info))
        socketRef.current?.emit('delete_task', {
            roomName: userInfoJSON.room,
            columnName: info.columnName,
            taskName: info.taskName
        })
        axios.post('http://localhost:3000/api/tasks/delete_task', {
            taskName: info.taskName,
            room: userInfoJSON.room
        })
    }

    const onDragEnd = async (result: DropResult) => {
        if (!userInfoJSON) return

        const { source, destination, draggableId } = result

        if (!destination) return

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        const fromColumn = source.droppableId as ColumnName
        const toColumn = destination.droppableId as ColumnName

        dispatch(moveTask({
            fromColumn,
            toColumn,
            fromIndex: source.index,
            toIndex: destination.index
        }))

        socketRef.current?.emit('move_task', {
            roomName: userInfoJSON.room,
            fromColumn,
            toColumn,
            fromIndex: source.index,
            toIndex: destination.index
        })

        await axios.put('http://localhost:3000/api/tasks/move_task', {
            room_name: userInfoJSON.room,
            title: draggableId,
            fromColumn,
            toColumn,
            fromIndex: source.index,
            toIndex: destination.index
        })
    }

    if (!userInfoJSON) {
        return null
    }

    return(
        <section className={style.board}>
            <div className={style.boardInner}>

                {isOpen && (
                    <Portal>
                        <div className={style.portalInner} style={{
                            flexDirection: 'column',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            height: '100%'}}
                        >

                            <div className={style.portal_newTask} style={{
                                width: '100%',
                                textAlign: 'center'}}
                            >

                                <h2 style={{marginBottom: '5px'}}>
                                    Введите название новой задачи
                                </h2>

                                <input type="text" style={{
                                    textAlign: 'center',
                                    width: '300px',
                                    height: '30px',
                                    paddingLeft: 10,
                                    borderRadius: '5px',
                                    }}
                                    value={newTaskName}
                                    onChange={(event) => handlerChangeNewTaskName(event.target.value)}
                                />

                            </div>

                            <div className={style.portal_addNewTask_button}>

                                <button style={{
                                    width: '300px',
                                    height: '30px',
                                    backgroundColor: '#ffff0000',
                                    borderRadius: '5px',
                                    cursor: 'pointer'}}
                                    onClick={handlerClickToSendNewTask}
                                >
                                    добавить
                                </button>

                            </div>

                        </div>
                    </Portal>
                )}

                    <DragDropContext onDragEnd={onDragEnd}>

                        <div className={`${style.column_plan} ${style.column}`}>

                        <div className={style.column_title}>
                            <h2>в планах</h2>
                        </div>

                        <Droppable droppableId='plan'>
                            {(provided, snapshot) => (
                                <div
                                    className={`${style.list_plan} ${style.list}`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{backgroundColor: snapshot.isDraggingOver ? '#eee' : ''}}
                                >

                                    {board.plan.map((taskName, index) => (
                                        <Draggable
                                            key={taskName}
                                            draggableId={taskName}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={style.task_line}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        opacity: snapshot.isDragging ? 0.7 : 1,
                                                    }}
                                                >
                                                    <div className={style.list_task}>
                                                        {(taskName).slice(0, 30)}
                                                        <button onClick={() => handlerClickToDeleteTask({columnName: 'plan', taskName: taskName})}>x</button>
                                                    </div>

                                                    <hr />

                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                               </div>
                            )}
                        </Droppable>

                        <div className={style.addNewTask_button}>
                            <button onClick={changePortal}>добавить задачу</button>
                        </div>

                        </div>

                        <div className={`${style.column_process} ${style.column}`}>

                            <div className={style.column_title}>
                            <h2>в процессе</h2>
                            </div>

                            <Droppable droppableId='process'>
                                {(provided, snapshot) => (
                                    <div
                                        className={`${style.list_process} ${style.list}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{backgroundColor: snapshot.isDraggingOver ? '#eee' : ''}}
                                    >

                                        {board.process.map((taskName,index) => (
                                            <Draggable
                                                key={taskName}
                                                draggableId={taskName}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={style.task_line}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        opacity: snapshot.isDragging ? 0.7 : 1,
                                                    }}
                                                >
                                                    <div className={style.list_task}>
                                                        {(taskName).slice(0, 30)}
                                                        <button onClick={() => handlerClickToDeleteTask({columnName: 'process', taskName: taskName})}>x</button>
                                                    </div>

                                                    <hr />

                                                </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                        </div>

                        <div className={`${style.column_ready} ${style.column}`}>

                            <div className={style.column_title}>
                                <h2>готово</h2>
                            </div>

                            <Droppable droppableId='ready'>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`${style.list_ready} ${style.list}`}
                                        style={{backgroundColor: snapshot.isDraggingOver ? '#eee' : ''}}
                                    >
                                        {board.ready.map((taskName, index) => (
                                            <Draggable
                                                key={taskName}
                                                draggableId={taskName}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={style.task_line}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.7 : 1,
                                                        }}
                                                    >
                                                        <div className={style.list_task}>
                                                            {(taskName).slice(0, 30)}
                                                            <button onClick={() => handlerClickToDeleteTask({columnName: 'ready', taskName: taskName})}>x</button>
                                                        </div>

                                                        <hr />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                        </div>

                    </DragDropContext>

            </div>
        </section>
    )
}
