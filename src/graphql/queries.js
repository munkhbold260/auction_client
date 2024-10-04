import { gql } from "@apollo/client";

// GET_CATEGORIES query
export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      category_id
      category_name
    }
  }
`;

// GET_ITEMS query
export const GET_ITEMS = gql`
  query GetItems {
    getItems {
      id
      item_id
      name
      description
      price
      auction_start
      auction_end
      category
      images_url
      item_type
    }
  }
`;

export const GET_ITEM_BY_ID = gql`
  query GetItemById($item_id: String!) {
    getItemById(item_id: $item_id) {
      item_id
      name
      description
      price
      auction_start
      auction_end
      category
      images_url
      item_type
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($userid: String!) {
    getUserById(userid: $userid) {
      name
      email
      balance
      userid
      phone
      userrole
    }
  }
`;

// export const GET_BIDS = gql`

//   query GetBidsByItemId($item_id: String!) {
//     get_bids_by_item_id(item_id: $item_id) {
//       bid_id
//       bidded_user_id
//       bid
//       created_at
//     }
//   }
// `;

export const GET_BIDS = gql`
  query GetBidsByItemId($item_id: String!) {
    get_bids_by_item_id(item_id: $item_id) {
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
