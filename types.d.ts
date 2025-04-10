export declare global {

    type JsonPrimitive = string | number | boolean | null;
    type JsonValue = JsonPrimitive | JsonObject | JsonArray;
    interface JsonObject { [key: string]: JsonValue; }
    interface JsonArray extends Array<JsonValue> {}
    type JsonSerializable = JsonValue;

    namespace PrismaJson {
        export type BankDetailsType = {
            accountNumber: string;
            accountName: string;
            bankName: string;
            ifscCode: string;
        }
        export type UPIDetailsType = { 
            upiId: string;
        }
        export type PaymentMethodStringType = "bank" | "upi"
        export type PaymentMethodType = (BankDetailsType|UPIDetailsType);
        export type UserType = "buyer" | "seller"
    }
}

declare global {
    namespace PrismaJson {
      type MyType = boolean;
      type ComplexType = { foo: string; bar: number };
    }
  }