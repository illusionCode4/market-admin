import Layout from '@/components/Layout';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // State to hold the selected order ID
  const [isLoading, setIsLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  const handleFillOrderClick = (orderId) => {
    setSelectedOrderId(orderId); // Set the selected order ID
  };

  const handleTrackingSubmit = async () => {
    try {
      // Make a POST request to your backend endpoint with the tracking number and selected order ID
      await axios.post('/api/orders', {
        selectedOrderId,
        trackingNumber,
      });
      console.log(selectedOrderId, trackingNumber);
      // Once the request is successful, you may want to update the UI or take other actions
      // For example, you could reload the orders to reflect the changes
      setIsLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setIsLoading(false);

      // Reset the selected order ID and tracking number input
      setSelectedOrderId(null);
      setTrackingNumber('');
    } catch (error) {
      // Handle errors, show an alert, or perform other actions based on the error
      console.error('Error submitting tracking number:', error);
    }
  };

  return (
    <Layout>
      <h1>Orders</h1>
      <table className='basic'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={6}>
                <div className='py-4'>
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                  {order.paid ? 'YES' : 'NO'}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x {l.quantity}
                      <br />
                    </>
                  ))}
                </td>

                <td className='font-bold'>
                  {order.confirmed
                    ? 'comfirmed☺︎'
                    : order.deliver
                    ? `Tracking number:${order.deliver}`
                    : 'not comfirmed yet ☹︎'}
                </td>
                <td>
                  {order.confirmed && ''}
                  {!order.confirmed &&
                    (selectedOrderId === order._id ? (
                      <div className='flex content-between'>
                        {/* Input field for tracking number */}
                        <input
                          type='text'
                          value={trackingNumber}
                          className='w-40 mr-2 rounded-lg'
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder='tracking number'
                        />
                        {/* Submit button */}
                        <button
                          onClick={handleTrackingSubmit}
                          className='mt-1 bg-blue-600  text-white px-2 py-1 rounded-lg h-8'
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      // If not selected, show the "Fill Order" button
                      <button
                        onClick={() => handleFillOrderClick(order._id)}
                        className='bg-blue-600 text-white px-2 py-1 rounded-lg'
                      >
                        Tracking number
                      </button>
                    ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
