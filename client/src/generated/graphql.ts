import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AuthUrl = {
  __typename?: 'AuthURL';
  state: Scalars['String'];
  url: Scalars['String'];
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  error: Scalars['String'];
};

export type LogClass = {
  __typename?: 'LogClass';
  id: Scalars['String'];
  reachable: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateService?: Maybe<ServiceClass>;
  DeleteService?: Maybe<ServiceClass>;
  ModifyService?: Maybe<ServiceClass>;
  Login: UserResponse;
  SignupOrLogin: UserResponse;
};


export type MutationCreateServiceArgs = {
  port: Scalars['Float'];
  socketType: Scalars['String'];
  url: Scalars['String'];
  name: Scalars['String'];
};


export type MutationDeleteServiceArgs = {
  id: Scalars['String'];
};


export type MutationModifyServiceArgs = {
  port: Scalars['Float'];
  socketType: Scalars['String'];
  url: Scalars['String'];
  name: Scalars['String'];
  id: Scalars['String'];
};


export type MutationSignupOrLoginArgs = {
  AppToken?: Maybe<Scalars['String']>;
  State: Scalars['String'];
  AccessToken: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  Services: Array<ServiceClass>;
  Service?: Maybe<ServiceClass>;
  ServiceWithLogs?: Maybe<ServiceClass>;
  GenerateAuthURL: AuthUrl;
};


export type QueryServiceArgs = {
  id: Scalars['String'];
};


export type QueryServiceWithLogsArgs = {
  id: Scalars['String'];
};

export type ServiceClass = {
  __typename?: 'ServiceClass';
  id: Scalars['String'];
  name: Scalars['String'];
  port: Scalars['Float'];
  url: Scalars['String'];
  socketType: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  logs: Array<LogClass>;
};

export type UserClass = {
  __typename?: 'UserClass';
  discordUserId: Scalars['String'];
  discordUsername: Scalars['String'];
  allowWriteAccess: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<UserClass>;
};

export type LoginMutationVariables = Exact<{ [key: string]: never; }>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { Login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'error'>
    )>>, user?: Maybe<(
      { __typename?: 'UserClass' }
      & Pick<UserClass, 'discordUserId' | 'discordUsername' | 'allowWriteAccess'>
    )> }
  ) }
);

export type SignupOrLoginMutationVariables = Exact<{
  AccessToken: Scalars['String'];
  State: Scalars['String'];
  AppToken?: Maybe<Scalars['String']>;
}>;


export type SignupOrLoginMutation = (
  { __typename?: 'Mutation' }
  & { SignupOrLogin: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'error'>
    )>>, user?: Maybe<(
      { __typename?: 'UserClass' }
      & Pick<UserClass, 'discordUserId' | 'discordUsername' | 'allowWriteAccess'>
    )> }
  ) }
);

export type GenerateAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateAuthUrlQuery = (
  { __typename?: 'Query' }
  & { GenerateAuthURL: (
    { __typename?: 'AuthURL' }
    & Pick<AuthUrl, 'url' | 'state'>
  ) }
);

export type ServiceWithLogsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ServiceWithLogsQuery = (
  { __typename?: 'Query' }
  & { ServiceWithLogs?: Maybe<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'createdAt' | 'updatedAt' | 'socketType' | 'port'>
    & { logs: Array<(
      { __typename?: 'LogClass' }
      & Pick<LogClass, 'id' | 'reachable' | 'createdAt'>
    )> }
  )> }
);

export type ServiceQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ServiceQuery = (
  { __typename?: 'Query' }
  & { Service?: Maybe<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'createdAt' | 'updatedAt' | 'socketType' | 'port'>
  )> }
);

export type ServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type ServicesQuery = (
  { __typename?: 'Query' }
  & { Services: Array<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'createdAt' | 'updatedAt' | 'socketType' | 'port'>
  )> }
);


export const LoginDocument = gql`
    mutation Login {
  Login {
    errors {
      field
      error
    }
    user {
      discordUserId
      discordUsername
      allowWriteAccess
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const SignupOrLoginDocument = gql`
    mutation SignupOrLogin($AccessToken: String!, $State: String!, $AppToken: String) {
  SignupOrLogin(AccessToken: $AccessToken, State: $State, AppToken: $AppToken) {
    errors {
      field
      error
    }
    user {
      discordUserId
      discordUsername
      allowWriteAccess
    }
  }
}
    `;

export function useSignupOrLoginMutation() {
  return Urql.useMutation<SignupOrLoginMutation, SignupOrLoginMutationVariables>(SignupOrLoginDocument);
};
export const GenerateAuthUrlDocument = gql`
    query GenerateAuthURL {
  GenerateAuthURL {
    url
    state
  }
}
    `;

export function useGenerateAuthUrlQuery(options: Omit<Urql.UseQueryArgs<GenerateAuthUrlQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GenerateAuthUrlQuery>({ query: GenerateAuthUrlDocument, ...options });
};
export const ServiceWithLogsDocument = gql`
    query ServiceWithLogs($id: String!) {
  ServiceWithLogs(id: $id) {
    id
    name
    url
    createdAt
    updatedAt
    socketType
    port
    logs {
      id
      reachable
      createdAt
    }
  }
}
    `;

export function useServiceWithLogsQuery(options: Omit<Urql.UseQueryArgs<ServiceWithLogsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ServiceWithLogsQuery>({ query: ServiceWithLogsDocument, ...options });
};
export const ServiceDocument = gql`
    query Service($id: String!) {
  Service(id: $id) {
    id
    name
    url
    createdAt
    updatedAt
    socketType
    port
  }
}
    `;

export function useServiceQuery(options: Omit<Urql.UseQueryArgs<ServiceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ServiceQuery>({ query: ServiceDocument, ...options });
};
export const ServicesDocument = gql`
    query Services {
  Services {
    id
    name
    url
    createdAt
    updatedAt
    socketType
    port
  }
}
    `;

export function useServicesQuery(options: Omit<Urql.UseQueryArgs<ServicesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ServicesQuery>({ query: ServicesDocument, ...options });
};