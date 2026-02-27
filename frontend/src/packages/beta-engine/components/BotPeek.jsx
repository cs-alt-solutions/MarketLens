/* src/packages/beta-engine/components/BotPeek.jsx */
import React from 'react';
import { BotCore } from './BotCore';
import './BotPeek.css';

export const BotPeek = ({ children }) => {
  return (
    <div className="btn-peek-wrapper">
       <div className="btn-peek-bot">
          <BotCore scale="normal" interactive={false} />
       </div>
       <div className="btn-peek-content">
          {children}
       </div>
    </div>
  );
};