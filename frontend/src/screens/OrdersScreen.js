import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder, listMyOrders } from '../actions/orderActions';

function OrdersScreen(props) {
  const myOrderList = useSelector(state => state.myOrderList);
  const { loading, orders, error } = myOrderList;

  const orderDelete = useSelector(state => state.orderDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = orderDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listMyOrders());
    return () => {
      //
    };
  }, [successDelete]);

  const deleteHandler = (order) => {
    dispatch(deleteOrder(order._id));
  }

  const orderDetail = (orderId) => {
    props.history.push('/order/' + orderId);
  }
  // return loading ? <div className="loading"><i className="fa fa-spinner fa-spin"></i></div> :
  return loading ? <div className="loading"><img className="no-result-found" src="/masks/loading.GIF"/></div> :
    <div className="content content-margined">

      <div className="order-header">
        <h3>Your Orders</h3>
      </div>
      <div className="order-list">
        {
          orders.length !== 0 ? 
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              {/* <th>USER</th> */}
              <th>PAID</th>
              <th>PAID AT</th>
              <th>DELIVERED</th>
              <th>DELIVERED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (<tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.createdAt}</td>
              <td>${order.totalPrice}</td>
              {/* <td>{order.user.name}</td> */}
              <td>{order.isPaid.toString()}</td>
              <td>{order.paidAt}</td>
              <td>{order.isDelivered.toString()}</td>
              <td>{order.deliveredAt}</td>
              <td>
                {/* <Link to={"/order/" + order._id} className="button secondary" >Details</Link> */}
                <button type="button" onClick={() => orderDetail(order._id)} className="button secondary">Details</button>
                {' '}
                <button type="button" onClick={() => deleteHandler(order)} className="button secondary">Delete</button>
              </td>
            </tr>))}
          </tbody>
        </table>
        :
        <div>You don't have orders yet.</div>
        }
        

      </div>
    </div>
}
export default OrdersScreen;