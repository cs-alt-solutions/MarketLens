/* src/features/workbench/components/VendorIntakeForm.jsx */
import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { TERMINOLOGY } from '../../../utils/glossary';

export const VendorIntakeForm = ({ onClose }) => {
    const { addVendor } = useInventory();
    const [formData, setFormData] = useState({ 
        name: '', 
        website: '', 
        leadTime: '', 
        contactInfo: '', 
        reliability: 100 
    });

    const onSubmit = async (e) => { 
        e.preventDefault(); 
        await addVendor(formData); 
        if(onClose) onClose(); 
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="lab-form-group mb-15">
                <label className="label-industrial">{TERMINOLOGY.VENDOR.ADD_VENDOR}</label>
                <input required type="text" className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="lab-form-group mb-15">
                <label className="label-industrial">{TERMINOLOGY.VENDOR.WEBSITE}</label>
                <input type="url" className="input-industrial" placeholder={TERMINOLOGY.VENDOR.URL_PLACEHOLDER} value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
            </div>
            <div className="lab-form-group mb-15">
                <label className="label-industrial">{TERMINOLOGY.VENDOR.LEAD_TIME}</label>
                <input type="number" className="input-industrial" value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: e.target.value})} />
            </div>
            <div className="lab-form-group mb-20">
                <label className="label-industrial">{TERMINOLOGY.VENDOR.NOTES}</label>
                <textarea className="input-industrial" rows="3" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary w-full">{TERMINOLOGY.GENERAL.SAVE}</button>
        </form>
    );
};