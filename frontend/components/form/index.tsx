import React from 'react';
import { Input } from 'rsuite';

export const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
