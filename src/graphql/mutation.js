import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        userid
        name
        email
        balance
        userrole
        phone
        id
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp(
    $name: String!
    $email: String!
    $phone: String!
    $password: String!
    $userid: String!
  ) {
    signUp(
      name: $name
      email: $email
      phone: $phone
      password: $password
      userid: $userid
    ) {
      name
      email
      userid
      balance
      userrole
      phone
    }
  }
`;
export const RENEW_TOKEN_MUTATION = gql`
  mutation RenewToken($token: String!) {
    renewToken(token: $token) {
      token
    }
  }
`;

export const SEND_OTP_MUTATION = gql`
  mutation SendOtp($email: String!) {
    sendOtp(email: $email) {
      success
      otp
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $email: String!
    $otp: String!
    $newPassword: String!
  ) {
    resetPassword(email: $email, otp: $otp, newPassword: $newPassword) {
      success
      message
    }
  }
`;

// export const ADD_BID_MUTATION = gql`
//   mutation AddBid(
//     $item_id: String!
//     $bid_id: String!
//     $bidded_user_id: String!
//     $bid: String!
//     $created_at: String!
//   ) {
//     addBid(
//       item_id: $item_id
//       bid_id: $bid_id
//       bidded_user_id: $bidded_user_id
//       bid: $bid
//       created_at: $created_at
//     ) {
//       bid_id
//       bidded_user_id
//       bid
//       created_at
//     }
//   }
// `;
export const ADD_BID_MUTATION = gql`
  mutation AddBid(
    $item_id: String!
    $bid_id: String!
    $bidded_user_id: String!
    $bid: String!
    $created_at: String!
    $bidded_user_name: String!
    $bidded_user_email: String!
    $bid_won_user_email: String!
    $bid_win: String!
  ) {
    addBid(
      item_id: $item_id
      bid_id: $bid_id
      bidded_user_id: $bidded_user_id
      bid: $bid
      created_at: $created_at
      bidded_user_name: $bidded_user_name
      bidded_user_email: $bidded_user_email
      bid_won_user_email: $bid_won_user_email
      bid_win: $bid_win
    ) {
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
