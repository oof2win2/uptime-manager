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

export type Query = {
  __typename?: 'Query';
  Services: Array<ServiceClass>;
  Service?: Maybe<ServiceClass>;
  ServiceWithLogs?: Maybe<ServiceClass>;
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
}
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
}
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
}