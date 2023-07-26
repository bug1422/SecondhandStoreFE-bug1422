import React from 'react';

function ExchangeManagement({ transactions }) {
  return (
    <div className="transaction-history" style={{ width: '85%', margin: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ order: '1', marginBottom: '20px' }}>Exchange Management</h1>
      <h2 style={{ order: '2', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px', marginBottom: '20px' }}></h2>
    <table className="transaction-history__table" style={{ order: '3' }}>
        <thead>
          <tr>
            <th className="transaction-history__table-header">Order ID</th>
            <th className="transaction-history__table-header">Seller </th>
            <th className="transaction-history__table-header">Seller Email</th>
            <th className="transaction-history__table-header">Buyer</th>
            <th className="transaction-history__table-header">Buyer Email</th>
            <th className="transaction-history__table-header">Product</th>
            <th className="transaction-history__table-header">Price</th>
            <th className="transaction-history__table-header">Date</th>
            <th className="transaction-history__table-header">Status</th>
           
          </tr>
        </thead>
      </table>
    </div>
  );
}

export default ExchangeManagement;




