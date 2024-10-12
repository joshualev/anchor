import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react'

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({ id, setIsModalNewTaskOpen}: Props) => {
    const { 
        data: tasks, 
        error,
        isLoading 
    } = useGetTasksQuery({ projectId: Number(id) })

    if (isLoading) return <div>Loading...</div>
    if (error || !tasks) return <div>An error occurred while fetching tasks</div>

  return (
    <div className="px-4 pb-8 xl:px-6">
        <div className="pt-5">
            <Header
                name="List"  
                buttonComponent={
                    <button 
                        onClick={() => setIsModalNewTaskOpen(true)}
                        className="flex items-center bg-blue-primary px-3 py-2 rounded text-white hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                }
                isSmallText
            />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks?.map((task:Task) => <TaskCard key={task.id} task={task} /> )}
        </div>
    </div>
  )
}

export default ListView