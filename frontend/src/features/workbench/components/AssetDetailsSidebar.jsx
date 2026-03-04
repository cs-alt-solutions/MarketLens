/* src/features/workbench/components/AssetDetailsSidebar.jsx */
import React from 'react';
import { Back, History, EditIcon } from '../../../components/Icons';
import { ImagePlaceholder } from '../../../components/ui/ImagePlaceholder';
import { TERMINOLOGY } from '../../../utils/glossary';
import { getFaviconUrl, getDomainFromUrl } from '../../../utils/formatters';

export const AssetDetailsSidebar = ({ selectedItem, activeTab, vendors, onClose, onEdit }) => {
  return (
    <div className="sidebar-col">
       <div className="keyword-header flex-between">
          <h3 className="label-industrial glow-purple">
              {selectedItem ? TERMINOLOGY.INVENTORY.DETAILS_TITLE : TERMINOLOGY.INVENTORY.SELECT_PROMPT}
          </h3>
          {selectedItem && (
              <button onClick={onClose} className="btn-icon-hover-clean">
                  <Back />
              </button>
          )}
       </div>
       
       <div className="keyword-list">
        {selectedItem ? (
          <div className="sidebar-panel animate-fade-in">
            {activeTab !== 'VENDORS' && <ImagePlaceholder text={TERMINOLOGY.INVENTORY.PHOTO_LABEL} />}
            
            {activeTab === 'VENDORS' && selectedItem.website && (
                <div className="pad-20 border-bottom-subtle bg-row-even flex-center">
                    <img src={getFaviconUrl(selectedItem.website, 128)} alt={selectedItem.name} className="vendor-logo-large" />
                </div>
            )}
            
            <div className="sidebar-inner pad-20">
              <div className="flex-between align-start mb-10">
                  <h3 className="detail-title m-0">{selectedItem.name}</h3>
                  <button onClick={onEdit} className="btn-icon-hover-clean text-accent mt-5">
                      <EditIcon />
                  </button>
              </div>
              
              {activeTab !== 'VENDORS' ? (
                  <>
                      <div className="mb-15 mt-10">
                          <span className="label-industrial">{TERMINOLOGY.INVENTORY.SUPPLIED_BY}</span>
                          <div className="mt-5 font-mono text-accent">
                              {selectedItem.vendorId && vendors.find(v => v.id === selectedItem.vendorId) 
                                  ? vendors.find(v => v.id === selectedItem.vendorId).name 
                                  : TERMINOLOGY.INVENTORY.NO_VENDOR}
                          </div>
                      </div>
                      
                      <div className="history-section mt-20">
                          <div className="label-industrial text-teal border-bottom-subtle mb-10 pb-5">
                              <History /> {TERMINOLOGY.INVENTORY.STOCK_HISTORY}
                          </div>
                          <div className="history-list flex-col gap-10">
                              {selectedItem.history?.length > 0 ? (
                                  selectedItem.history.map((log, idx) => (
                                      <div key={idx} className="flex-between p-10 bg-row-odd border-radius-2 border-subtle">
                                          <span className="font-small text-muted">{new Date(log.date).toLocaleDateString()}</span>
                                          <span className={log.qty > 0 ? 'text-good' : 'text-warning'}>
                                              {log.qty > 0 ? '+' : ''}{log.qty}
                                          </span>
                                      </div>
                                  ))
                              ) : (
                                  <div className="text-muted italic font-small">{TERMINOLOGY.INVENTORY.NO_HISTORY}</div>
                              )}
                          </div>
                      </div>
                  </>
              ) : (
                  <div className="vendor-details mt-20">
                      <div className="mb-20">
                          <span className="label-industrial">{TERMINOLOGY.VENDOR.WEBSITE}</span>
                          {selectedItem.website ? (
                              <div className="mt-5">
                                  <a href={selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`} target="_blank" rel="noreferrer" className="text-accent font-mono">
                                      {getDomainFromUrl(selectedItem.website)} ↗
                                  </a>
                              </div>
                          ) : (
                              <div className="mt-5 text-muted font-mono">{TERMINOLOGY.GENERAL.UNKNOWN}</div>
                          )}
                      </div>
                      <div className="mb-20">
                          <span className="label-industrial">{TERMINOLOGY.VENDOR.NOTES}</span>
                          <div className="mt-10 font-mono text-main bg-bg-app p-15 border-radius-2 border-subtle notes-display">
                              {selectedItem.contactInfo || TERMINOLOGY.GENERAL.NO_DATA}
                          </div>
                      </div>
                      <div className="mb-15">
                          <span className="label-industrial">{TERMINOLOGY.VENDOR.RELIABILITY}</span>
                          <div className={`text-xl font-bold mt-5 ${selectedItem.reliability >= 80 ? 'text-good' : 'text-warning'}`}>
                              {selectedItem.reliability}/100
                          </div>
                      </div>
                  </div>
              )}
            </div>
          </div>
        ) : (
            <div className="flex-center h-full text-muted italic font-small">
                {TERMINOLOGY.INVENTORY.SELECT_PROMPT}
            </div>
        )}
       </div>
    </div>
  );
};