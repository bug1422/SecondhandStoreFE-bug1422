import React from 'react';

function TransactionHistory({ transactions }) {
  return (
    <div className="transaction-history" style={{ width: '50%', margin: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ order: '1', marginBottom: '20px' }}>Transaction History</h1>
      <h2 style={{ order: '2', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px', marginBottom: '20px' }}>Total amount loaded: </h2>
    <table className="transaction-history__table" style={{ order: '3' }}>
        <thead>
          <tr>
            <th className="transaction-history__table-header">ID</th>
            <th className="transaction-history__table-header">TopUp Point</th>
            <th className="transaction-history__table-header">Full Name</th>
            <th className="transaction-history__table-header">Email</th>
            <th className="transaction-history__table-header">Date</th>
            <th className="transaction-history__table-header">Price</th>
            <th className="transaction-history__table-header">Status</th>
          </tr>
        </thead>
        
      </table>
    </div>
  );
}

export default TransactionHistory;