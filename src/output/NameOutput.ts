import { BaseOutput, Output, OutputTemplate } from '@jovotech/framework';

@Output()
export class NameOutput extends BaseOutput {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      listen: true,
    };
  }
}
