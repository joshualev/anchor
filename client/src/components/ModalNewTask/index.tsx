import Modal from '@/components/Modal';
import { Priority, Status, useCreateTaskMutation } from '@/state/api';
import React, { useState } from 'react'
import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?: string | null;
}

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
    const [createTask, {isLoading}] = useCreateTaskMutation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Backlog);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [authorUserId, setAuthorUserId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [projectId, setProjectId] = useState("");

    const handleSubmit = async () => {
        if (!title || !authorUserId || !(id !== null || projectId)) return;
        
        const formattedStartDate = formatISO(new Date(startDate), {representation: 'complete'});
        const formattedDueDate = formatISO(new Date(dueDate), {representation: 'complete'});
        await createTask({
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            authorUserId: parseInt(authorUserId),
            assignedUserId: parseInt(assignedUserId),
            projectId: id !== null ? Number(id) : Number(projectId),
        })
    }

    // Required fields
    const isFormValid = () => {
        return title && authorUserId && !(id !== null || projectId);
    }

    const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    const inputStyles = 
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
        <form 
            onSubmit={ (e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="my-4 space-y-6"
        >
            {/* Title */}
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e)=> setTitle(e.target.value)}
                className={inputStyles} 
            />
            {/* Description */}
            <textarea 
                placeholder="Description" 
                value={description} 
                onChange={(e)=> setDescription(e.target.value)}
                className={inputStyles} 
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                {/* Status */}
                <select 
                    value={status}
                    onChange={(e) => setStatus(Status[e.target.value as keyof typeof Status])}
                    className={selectStyles}
                >
                    <option value="">Select Status</option>
                    <option value={Status.ToDo}>To Do</option>
                    <option value={Status.WorkInProgress}>Work In Progress</option>
                    <option value={Status.UnderReview}>Under Review</option>
                    <option value={Status.Completed}>Completed</option>
                </select>
                {/* Priority */}
                <select 
                    value={priority}
                    onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
                    className={selectStyles}
                >
                    <option value="">Select Priority</option>
                    <option value={Priority.Urgent}>Urgent</option>
                    <option value={Priority.High}>High</option>
                    <option value={Priority.Medium}>Medium</option>
                    <option value={Priority.Low}>Low</option>
                    <option value={Priority.Backlog}>Backlog</option>
                </select>
            </div>

            {/* Tags */}
            <input 
                type="text" 
                placeholder="Tags (comma separated)" 
                value={tags} 
                onChange={(e)=> setTags(e.target.value)}
                className={inputStyles} 
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                {/* Start Date */}
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e)=> setStartDate(e.target.value)}
                    className={inputStyles} 
                />
                {/* Due Date */}
                <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e)=> setDueDate(e.target.value)}
                    className={inputStyles} 
                />
            </div>
        
            {/* Author User ID */}
            <input 
                type="text" 
                placeholder="Author User ID" 
                value={authorUserId} 
                onChange={(e)=> setAuthorUserId(e.target.value)}
                className={inputStyles}
            />
            {/* Assigned User ID */}
            <input 
                type="text" 
                placeholder="Assigned User ID" 
                value={assignedUserId} 
                onChange={(e)=> setAssignedUserId(e.target.value)}
                className={inputStyles}
            />
            {/* Project Id field - displays if id is null. */}
            {id === null && (
                <input 
                   type="text" 
                   placeholder="ProjectId" 
                   value={projectId} 
                   onChange={(e)=> setProjectId(e.target.value)}
                   className={inputStyles}
               /> 
            )}
            
            <button
                type="submit"
                className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none; focus:ring-2 focus:ring-blue-600 focus-offset-2 ${
                    !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={!isFormValid() || isLoading}
            >
                {isLoading ? "Creating..." : "Create Task"}
            </button>
        </form>
    </Modal>
}

export default ModalNewTask