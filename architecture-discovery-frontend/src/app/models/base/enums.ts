export enum ComponentType {
    Domain, Product, Process, Activity, Database, Service, Instance, Hardware
}

export enum ComponentTypeAbbr {
  D, Pr, P, A, DB, S, I, H
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
