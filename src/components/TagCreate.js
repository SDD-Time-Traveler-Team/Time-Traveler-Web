import React, { useState } from 'react';
import {
    Modal,
    Button,
    Input,
    Radio,
    Form,
    // Cascader,
    // InputNumber,
    // Select,
    // Switch,
    // TreeSelect,
    // DatePicker,  
    // TimePicker,
} from 'antd';

const formItemLayout = {
    // labelCol: {
    //     xs: {
    //         span: 24,
    //     },
    //     sm: {
    //         span: 8,
    //     },
    // },
    // wrapperCol: {
    //     xs: {
    //         span: 24,
    //     },
    //     sm: {
    //         span: 16,
    //     },
    // },
};

const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: 'Please select time!',
        },
    ],
};

const TagCreate = () => {

    const [value, setValue] = useState(1);

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (fieldsValue) => {
        const rangeValue = fieldsValue['range-picker'];
        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {
            ...fieldsValue,
            'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
            'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
            'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
            'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
            'range-time-picker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
            ],
            'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
        };
        console.log('Received values of form: ', values);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Create Tag
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form name="time_related_controls" {...formItemLayout} onFinish={onFinish}>
                    <Form.Item {...config}>
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={1}>
                                Event
                            </Radio>
                            <Radio value={2}>
                                To-do
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item 
                        label="Title"
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
                        <Input/>
                    </Form.Item>

                    {/* <Form.Item name="date-time-picker" label="Date" {...config} required={false}>
                        <DatePicker showTime format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item name="time-picker" label="TimePicker" {...config} required={false}>
                    <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                    <Form.Item label="Repeat" name="size">
                        <Radio.Group>
                            <Radio.Button value="1">once a day</Radio.Button>
                            <Radio.Button value="2">once a week</Radio.Button>
                            <Radio.Button value="3">once a month</Radio.Button>
                            <Radio.Button value="4">none</Radio.Button>
                        </Radio.Group>
                    </Form.Item> */}
                </Form>
            </Modal>
        </>
    );
};

export default TagCreate;