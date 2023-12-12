export const swaggerOptions = {
    swagger: {
        info: {
            title: "Вариант 8",
            description: "Проектирование и реализация REST-API информационной системы для учета услуг, оказываемых юридической консультационной фирмой",
            version: "1.0.0",
        },
        host: "localhost:3000",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Услуги", description: "Оказываемые юридические услуги" }],
    },
};

export const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
};
