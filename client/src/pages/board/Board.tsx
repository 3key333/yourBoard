import style from './board.module.scss'
import { usePortal } from '../../hooks/usePortal'
import { useState, type DragEvent } from 'react'
import { Portal } from '../../components/portal/portalModule'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { addNewTask, deleteTask } from '../../redux/slices/boardSlice'

export const Board = () => {

    const dispatch = useDispatch<AppDispatch>()

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
            dispatch(addNewTask(newTaskName))
        }
    }
    
    const handlerClickToDeleteTask = (info: {columnName: string, taskName: string}) => {
        dispatch(deleteTask({columnName: info.columnName, taskName: info.taskName}))
    }

    
    // D & D 
    const [currentDragTask, setCurrentDragTask] = useState<string>('')

    const dragStartHandler = (e: DragEvent<HTMLDivElement>, taskName) => {
        console.log('drag', taskName)
        setCurrentDragTask(taskName)
    }

    const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {

    }

    const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {

    }

    const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const dragDropHandler = (e: DragEvent<HTMLDivElement>, taskName) => {
        e.preventDefault()
        console.log('drop', taskName)

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

                    <div className={`${style.column_plan} ${style.column}`}>

                        <div className={style.column_title}>
                            <h2>в планах</h2>
                        </div>

                        <div className={`${style.list_plan} ${style.list}`}>
                            {board.plan.map((taskName) => (
                                <div key={taskName}>
                                    <div 
                                     className={style.list_task}
                                     draggable={true}
                                     onDragStart={(e) => dragStartHandler(e, taskName) } // сработает когда возьмем блок
                                     onDragLeave={(e) => dragLeaveHandler(e)}            // сработает когда выйдем за предел другого блока
                                     onDragEnd={(e) => dragEndHandler(e)}                // сработает когда отпустим перемещение
                                     onDragOver={(e) => dragOverHandler(e)}              // сработает когда мы находимся над другим блоком 
                                     onDrop={(e) => dragDropHandler(e, taskName)}        // сработает когда мы отпустили блок и расчитываем на действие

                                    >
                                        {(taskName).slice(0, 30)}
                                        <button onClick={() => handlerClickToDeleteTask({columnName: 'plan', taskName: taskName})}>x</button>
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </div>

                        <div className={style.addNewTask_button}>
                            <button onClick={changePortal}>добавить задачу</button>
                        </div>

                    </div>

                    <div className={`${style.column_process} ${style.column}`}>

                        <div className={style.column_title}>
                            <h2>в процессе</h2>
                        </div>

                        <div className={`${style.list_process} ${style.list}`}>

                        </div>

                    </div>

                    <div className={`${style.column_ready} ${style.column}`}>

                        <div className={style.column_title}>
                            <h2>готово</h2>
                        </div>

                        <div className={`${style.list_ready} ${style.list}`}>

                        </div>

                    </div>
                
            </div>
        </section>
    )
}