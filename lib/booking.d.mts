export function deliveryEnabled(endpoint: string | undefined, verified: string | undefined, mode?: string): boolean;
export function validateRequest(data: Record<string,string>, today: string): string;

export function processRequest(options:{live:false}): Promise<{demo:boolean;message:string}>;
