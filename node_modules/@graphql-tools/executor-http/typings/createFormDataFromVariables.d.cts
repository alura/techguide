import { FormData as DefaultFormData } from '@whatwg-node/fetch';
export declare function createFormDataFromVariables<TVariables>({ query, variables, operationName, extensions, }: {
    query: string;
    variables: TVariables;
    operationName?: string;
    extensions?: any;
}, { File: FileCtor, FormData: FormDataCtor, }: {
    File?: typeof File;
    FormData?: typeof DefaultFormData;
}): string | FormData | Promise<FormData>;
