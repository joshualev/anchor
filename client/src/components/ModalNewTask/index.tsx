import Modal from "@/components/Modal";
import { Priority, Status, useCreateTaskMutation, useGetUsersQuery, useGetAuthUserQuery } from "@/state/api";

import React, { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
    const { data: currentUser } = useGetAuthUserQuery({});
    const { 
        data: users, 
        isLoading: isUsersLoading,
        isError: isUsersError 
    } = useGetUsersQuery();
    const [createTask, { isLoading }] = useCreateTaskMutation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Backlog);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [projectId, setProjectId] = useState("");

    if (!currentUser?.userDetails) return <div>Error: User not authenticated</div>;
    if (isUsersLoading) return <div>Loading...</div>;
    if (isUsersError || !users) return <div>Error fetching users</div>;

    const handleSubmit = async () => {
        if (!title || !(id !== null || projectId)) return;

        const formattedStartDate = formatISO(new Date(startDate), {
            representation: "complete",
        });
        const formattedDueDate = formatISO(new Date(dueDate), {
            representation: "complete",
        });

        await createTask({
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            authorUserId: currentUser.userDetails.userId,
            assignedUserId: parseInt(assignedUserId),
            projectId: id !== null ? Number(id) : Number(projectId),
        });
    };

    const isFormValid = () => {
        return title && (id !== null || projectId);
    };

    const selectStyles =
        "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
            <form
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <select
                        className={selectStyles}
                        value={status}
                        onChange={(e) =>
                            setStatus(Status[e.target.value as keyof typeof Status])
                        }
                    >
                        <option value="">Select Status</option>
                        <option value={Status.ToDo}>To Do</option>
                        <option value={Status.WorkInProgress}>Work In Progress</option>
                        <option value={Status.UnderReview}>Under Review</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>
                    <select
                        className={selectStyles}
                        value={priority}
                        onChange={(e) =>
                            setPriority(Priority[e.target.value as keyof typeof Priority])
                        }
                    >
                        <option value="">Select Priority</option>
                        <option value={Priority.Urgent}>Urgent</option>
                        <option value={Priority.High}>High</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.Backlog}>Backlog</option>
                    </select>
                </div>
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className={inputStyles}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                {/* <input
                    type="text"
                    className={inputStyles}
                    placeholder="Author User ID"
                    value={currentUser.userDetails.userId}
                    onChange={(e) => setAuthorUserId(e.target.value)}
                /> */}
                <select
                    className={inputStyles}
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                >
                    <option value="">Select Assignee</option>
                    {users.map((user) => (
                        <option 
                            key={`new-task-assignee-${user.userId}`} 
                            value={user.userId}
                        >
                            {user.username}
                        </option>
                    ))}
                </select>
                {id === null && (
                    <input
                        type="text"
                        className={inputStyles}
                        placeholder="ProjectId"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    />
                )}
                <button
                    type="submit"
                    className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? "Creating..." : "Create Task"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewTask;
