import React from 'react';
import './Header.css'
import { useChecklist } from 'react-checklist';

const data = [
    { _id: 1, label: 'item 1' },
    { _id: 2, label: 'item 2' },
    { _id: 3, label: 'item 3' },
]

export default (st) => {
    const { handleCheck, isCheckedAll, checkedItems } = useChecklist(data, {
        key: '_id',
        keyType: 'number',
    });
    console.log(checkedItems);      // Set(0) - handling with Set
    console.log([...checkedItems]); // []     - handling with Array
    return (
        <ul>
            <li>
                <input
                    type="checkbox"
                    onChange={handleCheck}              // 1
                    checked={isCheckedAll}              // 2
                />
                <label>Check All</label>
            </li>

            {data.map((v, i) => (
                <li key={i}>
                    <input
                        type="checkbox"
                        data-key={v._id}                  // 3
                        onChange={handleCheck}            // 4
                        checked={checkedItems.has(v._id)} // 5
                    />
                    <label>{v.label}</label>
                </li>
            ))}

        </ul>
    );
};