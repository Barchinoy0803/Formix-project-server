import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsStringOrStringArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStringOrStringArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return (
                        typeof value === 'string' ||
                        (Array.isArray(value) && value.every((v) => typeof v === 'string'))
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a string or an array of strings`;
                },
            },
        });
    };
}
