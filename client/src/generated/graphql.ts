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

export type AuthCodeClass = {
  __typename?: 'AuthCodeClass';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type AuthCodeResponse = {
  __typename?: 'AuthCodeResponse';
  errors?: Maybe<Array<FieldError>>;
  code?: Maybe<AuthCodeClass>;
  codes: Array<AuthCodeClass>;
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

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  completed: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateService?: Maybe<ServiceClass>;
  DeleteService?: Maybe<ServiceClass>;
  ModifyService?: Maybe<ServiceClass>;
  Login: UserResponse;
  Logout?: Maybe<LogoutResponse>;
  SignupOrLogin: UserResponse;
  AllowWriteAccess: UserResponse;
  ForbidWriteAccess: UserResponse;
  createAuthCode: AuthCodeResponse;
  removeAuthCode: AuthCodeResponse;
};


export type MutationCreateServiceArgs = {
  postUpdating: Scalars['Boolean'];
  port: Scalars['Float'];
  socketType: Scalars['String'];
  url: Scalars['String'];
  name: Scalars['String'];
};


export type MutationDeleteServiceArgs = {
  id: Scalars['String'];
};


export type MutationModifyServiceArgs = {
  postUpdating: Scalars['Boolean'];
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


export type MutationAllowWriteAccessArgs = {
  discordUserId: Scalars['String'];
  code: Scalars['String'];
};


export type MutationForbidWriteAccessArgs = {
  discordUserId: Scalars['String'];
  code: Scalars['String'];
};


export type MutationRemoveAuthCodeArgs = {
  code: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  Services: Array<ServiceClass>;
  Service?: Maybe<ServiceClass>;
  ServiceWithLogs?: Maybe<ServiceClass>;
  GenerateAuthURL: AuthUrl;
  getAuthCodes: AuthCodeResponse;
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
  postUpdating: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  logs: Array<LogClass>;
};

export type Subscription = {
  __typename?: 'Subscription';
  updateUserSubscription: UserClass;
};

export type UserClass = {
  __typename?: 'UserClass';
  discordUserId: Scalars['String'];
  discordUserTag: Scalars['String'];
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

export type AllowWriteAccessMutationVariables = Exact<{
  code: Scalars['String'];
  discordUserId: Scalars['String'];
}>;


export type AllowWriteAccessMutation = (
  { __typename?: 'Mutation' }
  & { AllowWriteAccess: (
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

export type ForbidWriteAccessMutationVariables = Exact<{
  code: Scalars['String'];
  discordUserId: Scalars['String'];
}>;


export type ForbidWriteAccessMutation = (
  { __typename?: 'Mutation' }
  & { AllowWriteAccess: (
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

export type CreateAuthCodeMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAuthCodeMutation = (
  { __typename?: 'Mutation' }
  & { createAuthCode: (
    { __typename?: 'AuthCodeResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'error'>
    )>>, code?: Maybe<(
      { __typename?: 'AuthCodeClass' }
      & Pick<AuthCodeClass, 'createdAt'>
    )> }
  ) }
);

export type RemoveAuthCodeMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type RemoveAuthCodeMutation = (
  { __typename?: 'Mutation' }
  & { removeAuthCode: (
    { __typename?: 'AuthCodeResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'error'>
    )>>, code?: Maybe<(
      { __typename?: 'AuthCodeClass' }
      & Pick<AuthCodeClass, 'code' | 'createdAt'>
    )> }
  ) }
);

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

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & { Logout?: Maybe<(
    { __typename?: 'LogoutResponse' }
    & Pick<LogoutResponse, 'completed'>
  )> }
);

export type CreateServiceMutationVariables = Exact<{
  url: Scalars['String'];
  name: Scalars['String'];
  socketType: Scalars['String'];
  port: Scalars['Float'];
  postUpdating: Scalars['Boolean'];
}>;


export type CreateServiceMutation = (
  { __typename?: 'Mutation' }
  & { CreateService?: Maybe<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'socketType' | 'port' | 'createdAt' | 'updatedAt' | 'postUpdating'>
  )> }
);

export type DeleteServiceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteServiceMutation = (
  { __typename?: 'Mutation' }
  & { DeleteService?: Maybe<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'socketType' | 'port' | 'createdAt' | 'updatedAt'>
  )> }
);

export type ModifyServiceMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['String'];
  port: Scalars['Float'];
  socketType: Scalars['String'];
  postUpdating: Scalars['Boolean'];
}>;


export type ModifyServiceMutation = (
  { __typename?: 'Mutation' }
  & { ModifyService?: Maybe<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'socketType' | 'port' | 'createdAt' | 'updatedAt' | 'postUpdating'>
  )> }
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

export type GetAuthCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthCodesQuery = (
  { __typename?: 'Query' }
  & { getAuthCodes: (
    { __typename?: 'AuthCodeResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'error'>
    )>>, codes: Array<(
      { __typename?: 'AuthCodeClass' }
      & Pick<AuthCodeClass, 'code' | 'createdAt'>
    )> }
  ) }
);

export type ServiceQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ServiceQuery = (
  { __typename?: 'Query' }
  & { Service?: Maybe<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'createdAt' | 'updatedAt' | 'socketType' | 'port' | 'postUpdating'>
  )> }
);

export type ServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type ServicesQuery = (
  { __typename?: 'Query' }
  & { Services: Array<(
    { __typename?: 'ServiceClass' }
    & Pick<ServiceClass, 'id' | 'name' | 'url' | 'createdAt' | 'updatedAt' | 'socketType' | 'port' | 'postUpdating'>
  )> }
);


export const AllowWriteAccessDocument = gql`
    mutation AllowWriteAccess($code: String!, $discordUserId: String!) {
  AllowWriteAccess(code: $code, discordUserId: $discordUserId) {
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

export function useAllowWriteAccessMutation() {
  return Urql.useMutation<AllowWriteAccessMutation, AllowWriteAccessMutationVariables>(AllowWriteAccessDocument);
};
export const ForbidWriteAccessDocument = gql`
    mutation ForbidWriteAccess($code: String!, $discordUserId: String!) {
  AllowWriteAccess(code: $code, discordUserId: $discordUserId) {
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

export function useForbidWriteAccessMutation() {
  return Urql.useMutation<ForbidWriteAccessMutation, ForbidWriteAccessMutationVariables>(ForbidWriteAccessDocument);
};
export const CreateAuthCodeDocument = gql`
    mutation createAuthCode {
  createAuthCode {
    errors {
      field
      error
    }
    code {
      createdAt
    }
  }
}
    `;

export function useCreateAuthCodeMutation() {
  return Urql.useMutation<CreateAuthCodeMutation, CreateAuthCodeMutationVariables>(CreateAuthCodeDocument);
};
export const RemoveAuthCodeDocument = gql`
    mutation removeAuthCode($code: String!) {
  removeAuthCode(code: $code) {
    errors {
      field
      error
    }
    code {
      code
      createdAt
    }
  }
}
    `;

export function useRemoveAuthCodeMutation() {
  return Urql.useMutation<RemoveAuthCodeMutation, RemoveAuthCodeMutationVariables>(RemoveAuthCodeDocument);
};
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
export const LogoutDocument = gql`
    mutation Logout {
  Logout {
    completed
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const CreateServiceDocument = gql`
    mutation CreateService($url: String!, $name: String!, $socketType: String!, $port: Float!, $postUpdating: Boolean!) {
  CreateService(
    url: $url
    name: $name
    socketType: $socketType
    port: $port
    postUpdating: $postUpdating
  ) {
    id
    name
    url
    socketType
    port
    createdAt
    updatedAt
    postUpdating
  }
}
    `;

export function useCreateServiceMutation() {
  return Urql.useMutation<CreateServiceMutation, CreateServiceMutationVariables>(CreateServiceDocument);
};
export const DeleteServiceDocument = gql`
    mutation DeleteService($id: String!) {
  DeleteService(id: $id) {
    id
    name
    url
    socketType
    port
    createdAt
    updatedAt
  }
}
    `;

export function useDeleteServiceMutation() {
  return Urql.useMutation<DeleteServiceMutation, DeleteServiceMutationVariables>(DeleteServiceDocument);
};
export const ModifyServiceDocument = gql`
    mutation ModifyService($id: String!, $name: String!, $url: String!, $port: Float!, $socketType: String!, $postUpdating: Boolean!) {
  ModifyService(
    id: $id
    name: $name
    url: $url
    port: $port
    socketType: $socketType
    postUpdating: $postUpdating
  ) {
    id
    name
    url
    socketType
    port
    createdAt
    updatedAt
    postUpdating
  }
}
    `;

export function useModifyServiceMutation() {
  return Urql.useMutation<ModifyServiceMutation, ModifyServiceMutationVariables>(ModifyServiceDocument);
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
export const GetAuthCodesDocument = gql`
    query getAuthCodes {
  getAuthCodes {
    errors {
      field
      error
    }
    codes {
      code
      createdAt
    }
  }
}
    `;

export function useGetAuthCodesQuery(options: Omit<Urql.UseQueryArgs<GetAuthCodesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAuthCodesQuery>({ query: GetAuthCodesDocument, ...options });
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
    postUpdating
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
    postUpdating
  }
}
    `;

export function useServicesQuery(options: Omit<Urql.UseQueryArgs<ServicesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ServicesQuery>({ query: ServicesDocument, ...options });
};