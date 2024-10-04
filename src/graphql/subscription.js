import { gql } from "@apollo/client";

// export const ADD_BID_SUBSCRIPTION = gql`
//   subscription OnBidAdded($item_id: String!) {
//     OnBidAdded(item_id: $item_id) {
//       bid_id
//       bidded_user_id
//       bid
//       created_at
//     }
//   }
// `;

export const ADD_BID_SUBSCRIPTION = gql`
  subscription OnBidAdded($item_id: String!) {
    OnBidAdded(item_id: $item_id) {
      bid_id
      bidded_user_id
      bid
      created_at
      bidded_user_name
      bidded_user_email
      bid_won_user_email
      bid_win
    }
  }
`;
