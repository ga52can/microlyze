export enum ComponentType {
    Process, Activity, Service, Instance, Hardware, Domain, Product
}

export enum ArchitectureElementType {
    REVISION, COMPONENT, RELATION
}

export enum ArchitectureElementOperation {
    CREATED, DELETED, UPDATED
}

export enum HttpMethod {
    GET = 1, PUT = 2, POST = 4, DELETE = 8
}
