import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Checkbox, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import { useEffect } from "react";
//import listPlugin from '@fullcalendar/list';

const Calendar = ({ events, setEvents, tasks, setTasks }) => {
    //console.log("calendar rendered");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClickedTask, setIsClickedTask] = useState(false);
    const [completeBoxChecked, setCompleteBoxChecked] = useState(false);
    const [clickedItem, setClickedItem] = useState();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [modifyForm] = Form.useForm();

    // useEffect(() => {
    //     console.log(clickedItem);
    // }, [clickedItem]);

    const onEventChange = ({ event, oldEvent, revert }) => {
        // console.log(event);
        // console.log(oldEvent);

        //TODO: change in db
        if (oldEvent.extendedProps.hasOwnProperty("completed")) {
            // task
            setTasks((prev) =>
                prev.map((task) => {
                    //  task {id, title, tagId, start, end, completed}
                    if ("task" + task.id === oldEvent.id) {
                        return {
                            id: task.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            tagId: event.extendedProps.tagId,
                            completed: event.extendedProps.completed,
                        };
                    } else {
                        return task;
                    }
                })
            );
        } else {
            // event
            setEvents((prev) =>
                prev.map((item) => {
                    if ("event" + item.id === oldEvent.id) {
                        return {
                            id: item.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            tagId: event.extendedProps.tagId,
                        };
                    } else {
                        return item;
                    }
                })
            );
        }
    };

    const onEventRemove = ({ event, revert }) => {
        //TODO: remove in db
        if (event.extendedProps.hasOwnProperty("completed")) {
            // task
            setTasks((prev) => prev.filter((task) => "task" + task.id !== event.id));
        } else {
            // event
            setEvents((prev) => prev.filter((item) => "event" + item.id !== event.id));
        }
    };

    const onEventClick = ({ event }) => {
        setClickedItem({});
        setIsModalOpen(true);
        if (event.extendedProps.hasOwnProperty("completed")) {
            setClickedItem({
                id: event.id.replace('task', ''),
                title: event.title,
                start: event.start.toISOString().split('.')[0],
                end: event.end.toISOString().split('.')[0],
                tagId: event.extendedProps.tagId,
                completed: event.extendedProps.completed,
            });
        }
        else{
            setClickedItem({
                id: event.id.replace('event', ''),
                title: event.title,
                start: event.start.toISOString().split('.')[0],
                end: event.end.toISOString().split('.')[0],
                tagId: event.extendedProps.tagId,
            });
        }
        setIsClickedTask(false);
        setIsFormOpen(false);
        setIsClickedTask(event.extendedProps.hasOwnProperty("completed"));
        console.log(clickedItem)
    };

    const handleModalOk = () => {
        modifyForm
            .validateFields()
            .then(() => modifyForm.submit())
            .then(() => {
                console.log(clickedItem)
                if (clickedItem.hasOwnProperty("completed")) {
                    setClickedItem({
                        id: clickedItem.id,
                        title: clickedItem.title,
                        start: clickedItem.start,
                        end: clickedItem.end,
                        tagId: clickedItem.tagId,
                        completed: true,
                    });
                    if(clickedItem.completed)
                    {
                        setTasks((prev) => prev.filter((task) => task.id !== clickedItem.id));
                    }
                }
                else
                {
                    setClickedItem({
                        id: clickedItem.id,
                        title: clickedItem.title,
                        start: clickedItem.start,
                        end: clickedItem.end,
                        tagId: clickedItem.tagId,
                    });
                    setEvents((prev) => prev.filter((event) => event.id !== clickedItem.id));
                }
                setIsModalOpen(false);
                setClickedItem({});
                setIsClickedTask(false)
            })
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const onDeleteEvent = () => {
        if (clickedItem.hasOwnProperty("completed")) {
            // task
            setTasks((prev) => prev.filter((task) => task.id !== clickedItem.id));
        } else {
            // event
            setEvents((prev) => prev.filter((item) => item.id !== clickedItem.id));
        }
        setIsModalOpen(false);
        setClickedItem({});
    };

    const onFinish = (values) => {
        if(! isFormOpen)
        {
            return ;
        }
        
        if(Object.keys(clickedItem).length > 0){
            if (clickedItem.hasOwnProperty("completed")) {
                // task
                let newItem = {id: clickedItem.id,
                    title: values.title,
                    start: clickedItem.start,
                    end: clickedItem.end,
                    tagId: clickedItem.tagId,
                    completed: clickedItem.completed,}
                setTasks((prev) => prev.filter((task) => task.id !== clickedItem.id));
                setTasks(prev => [...prev, newItem])
            } else {
                // event
                let newItem = {id: clickedItem.id,
                    title: values.title,
                    start: clickedItem.start,
                    end: clickedItem.end,
                    tagId: clickedItem.tagId,}
                setEvents((prev) => prev.filter((item) => item.id !== clickedItem.id));
                setEvents(prev => [...prev, newItem])
            }
            //clickedItem.remove()
            //console.log(newItem)
            
        }
        
        setClickedItem();
    };

    const config = {
        rules: [
            {
                type: "object",
                required: true,
                message: "Please select time",
            },
        ],
    };

    return (
        <>
            <Modal
                title="Modify or Delete"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                {isClickedTask ? (
                    <Checkbox defaultChecked={false} onChange={(e) => setCompleteBoxChecked(e.target.checked)}>
                        Complete
                    </Checkbox>
                ) : (
                    <></>
                    
                )}
                <Button type="primary" onClick={() => setIsFormOpen(true)}>
                    Modify
                </Button>
                <Button type="primary" danger onClick={onDeleteEvent}>
                    Delete
                </Button>
                {isFormOpen ? (
                    <Form
                        id="tagCreateForm"
                        form={modifyForm}
                        name="time_related_controls"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a title",
                                },
                            ]}
                            required="true"
                            wrapperCol={{
                                xs: {
                                    span: 0,
                                    offset: 0,
                                },
                                sm: {
                                    span: 16,
                                    offset: 0,
                                },
                            }}
                        >
                            <Input />
                        </Form.Item>

                        {/* TODO: change start time */}
                        {/* <Form.Item name="date-time-picker" label="start-time" {...config}>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item> */}
                    </Form>
                ) : (
                    <></>
                )}
            </Modal>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    center: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                editable
                events={events.concat(tasks).map((event) => {
                    const newEvent = {
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        textColor: "#2F4F4F",
                        extendedProps: {
                            tagId: event.tagId,
                        },
                    };

                    if (event.hasOwnProperty("completed")) {
                        // task
                        newEvent.id = `task${event.id}`;
                        newEvent.extendedProps.completed = event.completed;
                        newEvent.backgroundColor = "#1E90FF";
                    } else {
                        // event
                        newEvent.id = `event${event.id}`;
                        newEvent.backgroundColor = "#FFE4B5";
                    }

                    return newEvent;
                })}
                eventChange={onEventChange}
                eventRemove={onEventRemove}
                eventClick={onEventClick}
            />
        </>
    );
};

export default Calendar;
