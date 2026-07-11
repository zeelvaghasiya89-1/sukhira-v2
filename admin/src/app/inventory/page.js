"use client";
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadInventory() {
      try {
        const res = await fetch('/api/inventory');
        const data = await res.json();
        if (res.ok) {
          setInventory(data.inventory || []);
        }
      } catch (err) {
        console.error('Failed to load inventory', err);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(item.variant_id);
    setEditStock(item.stock);
  };

  const handleSaveStock = async (variantId) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, stock: editStock })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setInventory(inventory.map(item => 
          item.variant_id === variantId ? { ...item, stock: editStock } : item
        ));
        setEditingId(null);
      } else {
        alert('Failed to update stock level');
      }
    } catch (err) {
      alert('Network error updating stock');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading inventory stats...</div>;
  }

  return (
    <div>
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>
          Monitor variant stock counts and update current levels inline. Low stock alerts are highlighted automatically based on set thresholds.
        </p>
      </div>

      {inventory.length === 0 ? (
        <p style={{ color: 'var(--admin-muted)', textAlign: 'center' }}>No products or variants found.</p>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Variant</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Alert Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLowStock = item.stock <= item.low_stock_threshold;
                const isEditing = editingId === item.variant_id;

                return (
                  <tr key={item.variant_id} style={{
                    backgroundColor: isLowStock ? 'rgba(239, 68, 68, 0.02)' : 'inherit'
                  }}>
                    <td style={{ fontWeight: '500' }}>{item.product_name}</td>
                    <td>{item.variant_name}</td>
                    <td style={{ fontFamily: 'monospace' }}>{item.sku}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '8px', width: '120px' }}>
                          <input 
                            type="number" 
                            value={editStock} 
                            onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                            style={{ padding: '6px 10px', fontSize: '14px' }}
                            required
                          />
                          <button 
                            disabled={updating}
                            onClick={() => handleSaveStock(item.variant_id)}
                            style={{ color: 'var(--admin-success)', fontSize: '14px', fontWeight: 'bold' }}
                          >
                            ✓
                          </button>
                          <button 
                            disabled={updating}
                            onClick={() => setEditingId(null)}
                            style={{ color: 'var(--admin-danger)', fontSize: '14px', fontWeight: 'bold' }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontWeight: '600' }}>{item.stock} units</span>
                      )}
                    </td>
                    <td>{item.low_stock_threshold} units</td>
                    <td>
                      {item.stock === 0 ? (
                        <span className="status-badge status-badge-cancelled">Out of Stock</span>
                      ) : (
                        isLowStock ? (
                          <span className="status-badge status-badge-pending">Low Stock Alert</span>
                        ) : (
                          <span className="status-badge status-badge-confirmed">Healthy</span>
                        )
                      )}
                    </td>
                    <td>
                      {!isEditing && (
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="admin-btn admin-btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
