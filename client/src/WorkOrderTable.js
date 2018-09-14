import React from 'react';
import { Subscription } from "react-apollo";
import gql from "graphql-tag";

const WorkOrderTable = () => (
  <Subscription
    subscription={gql`
        subscription {
             work_orders {
                id
                work_order_no
                contractor {
                    name
                }
            }
        }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return data.work_orders.map((wo) => (
        <div key={wo.id}>
          <p>{`${wo.work_order_no} by ${wo.contractor && wo.contractor.name}`}</p>
        </div>
      ));
    }}
  </Subscription>
);

export default WorkOrderTable;


// subscription getResult($pollId: uuid!) {
//     poll_results (
//       order_by: option_id_desc,
//       where: { poll_id: {_eq: $pollId} }
//     ) {
//       option_id
//       option { id text }
//       votes
//     }
//   }