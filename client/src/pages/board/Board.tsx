import style from './board.module.scss';
import { usePortal } from '../../hooks/usePortal';
import { useEffect, useState } from 'react';
import { Portal } from '../../components/portal/portalModule';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { addNewTask, deleteTask, moveTask } from '../../redux/slices/boardSlice';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { io, type Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';


export const Board = () => {

    const dispatch = useDispatch<AppDispatch>()

    const navigate = useNavigate()

    const { user } = useSelector((state: RootState) => state.auth)
    const rawJSONUserInfo = localStorage.getItem('userInfo')
    if(!rawJSONUserInfo) navigate('/')
    const userInfoJSON: {id: string, name: string, room: string} = JSON.parse(rawJSONUserInfo)

    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        
        const newSocket = io('http://localhost:3000')

        setSocket(newSocket)

        newSocket.on('connect', () => {

            newSocket.emit('join_room', {userName: userInfoJSON.name, roomName: userInfoJSON.room})

            newSocket.on('add_task', (data: {roomName: string, taskName: string}) => {
                dispatch(addNewTask(data.taskName))
            })

            newSocket.on('delete_task', (data: {columnName: string, taskName: string}) => {
                dispatch(deleteTask(data))
            })

            newSocket.on('move_task', (data) => {
                dispatch(moveTask(data))
            })
        })

        return () => {
            newSocket.disconnect()
        }

    }, [navigate])

    const { isOpen, changePortal } = usePortal()

    const [newTaskName, setNewTaskName] = useState<string>('')

    const { board } = useSelector((state: RootState) => state.board)

    const handlerChangeNewTaskName = (text) => {
        setNewTaskName(text)
    }

    const handlerClickToSendNewTask = () => {
        changePortal()
        setNewTaskName('')
        if(newTaskName.trim() !== ''){
            socket.emit('add_task', {roomName: userInfoJSON.room, taskName: newTaskName})
            dispatch(addNewTask(newTaskName))
        }
    }
    
    const handlerClickToDeleteTask = (info: {columnName: string, taskName: string}) => {
        dispatch(deleteTask({columnName: info.columnName, taskName: info.taskName}))
        socket.emit('delete_task', {roomName: userInfoJSON.room, columnName: info.columnName, taskName: info.taskName})
    }

    
    // D & D 

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result

        // destination = null → бросил мимо колонки, ничего не делаем
        if(!destination) return

        // та же колонка и та же позиция → задача не сдвинулась
        if(
            source.droppableId === destination.droppableId && 
            source.index === destination.index
        ){
            return
        }

        // source / destination    — откуда и куда
        // source.droppableId      — id колонки-источника ('plan', 'process', 'ready')
        // source.index            — индекс задачи в массиве
        // destination.droppableId — id колонки-назначения
        // destination.index       — куда вставить
        // draggableId             — id перетаскиваемой задачи (обычно taskName)

        dispatch(moveTask({
            fromColumn: source.droppableId, 
            toColumn: destination.droppableId, 
            fromIndex: source.index, 
            toIndex: destination.index
        }))

        socket.emit('move_task', {
            roomName: userInfoJSON.room, 
            fromColumn: source.droppableId, 
            toColumn: destination.droppableId,
            fromIndex: source.index,
            toIndex: destination.index
        })

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
                        {/* DragDropContext — это корневой компонент, который должен оборачивать все Droppable и Draggable компоненты.
                        Он принимает колбэк onDragEnd, который вызывается после завершения перетаскивания . */}
                        
                        <div className={`${style.column_plan} ${style.column}`}>

                        <div className={style.column_title}>
                            <h2>в планах</h2>
                        </div>

                        {/* Droppable = зона, куда можно бросить карточки */}

                        <Droppable droppableId='plan'>
                            {(provided, snapshot) => (
                                <div 
                                    className={`${style.list_plan} ${style.list}`}
                                    ref={provided.innerRef}        // ОБЯЗАТЕЛЬНО — без ref D&D не работает
                                    {...provided.droppableProps}   // слушатели drop-зоны
                                    style={{backgroundColor: snapshot.isDraggingOver ? '#eee' : ''}}  // подсветка при наведении
                                >

                                    {board.plan.map((taskName, index) => (
                                        /* Draggable = одна таска */
                                        <Draggable 
                                            key={taskName}            // key для React
                                            draggableId={taskName}    // уникальный id (если 2 задачи с одним именем — будет ошибка!)
                                            index={index}             // позиция в массиве — ОБЯЗАТЕЛЬНО
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}       // ref на перетаскиваемый элемент
                                                    {...provided.draggableProps}  // позиция при drag
                                                    {...provided.dragHandleProps} // за что хвататься (можно только на часть карточки)
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
                                    {/* placeholder — резервирует место, пока тащишь карточку */}
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
                                                    ref={provided.innerRef}       // ref на перетаскиваемый элемент
                                                    {...provided.draggableProps}  // позиция при drag
                                                    {...provided.dragHandleProps} // за что хвататься (можно только на часть карточки)
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