// Simulated tracking logs based on package age
function getSimulatedCheckpoints(orderDateStr) {
  const orderDate = orderDateStr ? new Date(orderDateStr) : new Date(Date.now() - 4 * 3600000);
  const elapsedMs = Date.now() - orderDate.getTime();
  const elapsedHours = elapsedMs / 3600000;

  const timeline = [
    { hours: 0.1, status: 'Manifested', location: 'Surat (Gujarat)', desc: 'Shipment details received and package manifested.' },
    { hours: 2.0, status: 'Picked Up', location: 'Surat (Gujarat) Hub', desc: 'Package picked up by Delhivery courier associate.' },
    { hours: 8.0, status: 'In Transit', location: 'Surat Sorting Facility', desc: 'Package arrived at sorting facility.' },
    { hours: 16.0, status: 'In Transit', location: 'Surat Sorting Facility', desc: 'Package departed sorting hub and in transit to destination.' },
    { hours: 36.0, status: 'In Transit', location: 'Destination Sorting Center', desc: 'Package received at sorting facility near destination.' },
    { hours: 44.0, status: 'Out for Delivery', location: 'Local Delivery Center', desc: 'Package is out for delivery with executive.' },
    { hours: 46.0, status: 'Delivered', location: 'Destination Address', desc: 'Package successfully delivered. Signed by recipient.' }
  ];

  const checkpoints = [];
  let currentStatus = 'Manifested';
  
  for (const step of timeline) {
    if (elapsedHours >= step.hours) {
      checkpoints.unshift({
        status: step.status,
        location: step.location,
        description: step.desc,
        timestamp: new Date(orderDate.getTime() + step.hours * 3600000).toISOString()
      });
      currentStatus = step.status;
    }
  }

  return {
    status: currentStatus,
    checkpoints: checkpoints.length > 0 ? checkpoints : [{
      status: 'Manifested',
      location: 'Surat (Gujarat)',
      description: 'Shipment details received and package manifested.',
      timestamp: orderDate.toISOString()
    }]
  };
}

async function createShipment(orderData, weightKg = 0.5) {
  const apiKey = process.env.DELHIVERY_API_KEY;
  const warehouse = process.env.DELHIVERY_WAREHOUSE_NAME || 'SUKHIRA_SURAT';

  if (!apiKey) {
    // Simulator Mode
    console.log('[Delhivery Simulator] Creating shipment for order:', orderData.order_number);
    const waybill = 'DLV' + Math.floor(100000000 + Math.random() * 900000000);
    // Point mock labels to backend server port route
    const labelUrl = `/api/admin/orders/${orderData.id}/label-preview`;
    return {
      success: true,
      waybill,
      label_url: labelUrl,
      mode: 'simulator'
    };
  }

  // Live API Mode
  try {
    const payload = {
      shipments: [
        {
          name: orderData.shipping_name,
          add: orderData.shipping_address,
          pin: orderData.shipping_pincode,
          phone: orderData.shipping_phone,
          payment_mode: orderData.payment_status === 'paid' ? 'Prepaid' : 'COD',
          cod_amount: orderData.payment_status === 'paid' ? 0.0 : orderData.total,
          order: orderData.order_number,
          weight: Math.round(weightKg * 1000), // in grams
          pickup_location: warehouse
        }
      ]
    };

    const res = await fetch('https://track.delhivery.com/api/cmu/create.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    if (data && data.packages && data.packages.length > 0) {
      const pkg = data.packages[0];
      return {
        success: pkg.status === 'Success',
        waybill: pkg.waybill,
        label_url: `https://track.delhivery.com/api/p/packing_slip?wbns=${pkg.waybill}`,
        error: pkg.remarks ? pkg.remarks.join(', ') : null,
        mode: 'live'
      };
    }
    return { success: false, error: 'Empty packaging response from Delhivery API.' };
  } catch (err) {
    console.error('Delhivery live API error:', err);
    return { success: false, error: err.message };
  }
}

async function trackShipment(waybill, orderDateStr) {
  const apiKey = process.env.DELHIVERY_API_KEY;

  if (!apiKey || waybill.startsWith('DLV')) {
    // Simulator Mode
    return getSimulatedCheckpoints(orderDateStr);
  }

  // Live API Mode
  try {
    const res = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`, {
      headers: {
        'Authorization': `Token ${apiKey}`
      }
    });
    const data = await res.json();
    if (data && data.ScanHistory) {
      const scans = data.ScanHistory.map(scan => ({
        status: scan.Status || 'In Transit',
        location: scan.Location || 'Delhivery Center',
        description: scan.Instructions || scan.Status,
        timestamp: scan.DateTime ? new Date(scan.DateTime).toISOString() : new Date().toISOString()
      }));
      return {
        status: data.Status?.Status || 'In Transit',
        checkpoints: scans.reverse()
      };
    }
    return {
      status: 'Unknown',
      checkpoints: []
    };
  } catch (err) {
    console.error('Delhivery Live tracking error:', err);
    return {
      status: 'Error',
      checkpoints: []
    };
  }
}

module.exports = {
  createShipment,
  trackShipment
};
