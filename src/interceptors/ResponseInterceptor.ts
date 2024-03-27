import {Interceptor, InterceptorInterface, Action} from 'routing-controllers';

@Interceptor()
export default class ResponseInterceptor implements InterceptorInterface {

    intercept(action: Action, data: any) {
        return {
            status: 'Success',
            message: 'Operation Successful',
            data,
        };
    }

}