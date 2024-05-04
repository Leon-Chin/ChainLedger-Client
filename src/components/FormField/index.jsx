import React from 'react'
import './index.less'
import { DatePicker } from 'antd';

const FormField = ({ labelName, placeholder, inputType, value, handleChange }) => {
    const showDatePicker = inputType === 'date'
    return (
        <label
            className='FormField'
            style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}
        >
            {labelName && (
                <span
                    style={{ fontFamily: 'Epilogue', fontWeight: '500', fontSize: '14px', lineHeight: '22px', color: '#808191', marginBottom: 10 }}
                >{labelName}</span>
            )}
            {showDatePicker ? (
                <DatePicker
                    placement='bottomRight'
                    variant="borderless"
                    required={true}
                    style={{ padding: '15px 15px', outline: 'none', minWidth: 300, border: '2px solid #3a3a43', borderRadius: 10, fontFamily: 'Epilogue', backgroundColor: 'transparent', color: '#fff', fontFamily: 'Epilogue', fontWeight: '400', fontSize: '14px', lineHeight: '22px', resize: 'none' }}
                    placeholder={placeholder}
                    onChange={(e) => {
                        const timestamp = new Date(e).getTime()
                        const mock = { target: { value: timestamp } }
                        handleChange(mock)
                    }}
                />
            ) : (
                <input
                    required
                    value={value}
                    onChange={handleChange}
                    type={inputType}
                    step="0.1"
                    placeholder={placeholder}
                    style={{ padding: '15px 15px', outline: 'none', minWidth: 300, border: '2px solid #3a3a43', borderRadius: 10, fontFamily: 'Epilogue', backgroundColor: 'transparent', color: '#fff', fontFamily: 'Epilogue', fontWeight: '400', fontSize: '14px', lineHeight: '22px', resize: 'none' }}
                />
            )}
        </label>
    )
}

export default FormField