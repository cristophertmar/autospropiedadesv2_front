import { CustomerPayment } from './customer_payment.model';
export class PaymentDatos {

    constructor(
        public amount?: number,
        public currency?: string,
        public orderId?: string,
        public customer?: CustomerPayment
    ) {}

}