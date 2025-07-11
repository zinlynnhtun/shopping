import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import React, { memo } from 'react';

type TitleProps = {
    title: string;
    actionText?: string;
}

const Title = ({ title, actionText }: TitleProps) => {
    return (
        <HStack className='m-2 justify-between items-center' >
            <Text size='lg' className='font-medium text-black'>{title}</Text>
            <Pressable>
                <Text size='lg' className='font-medium text-gray-500'>{actionText}</Text>
            </Pressable>
        </HStack>
    )
}

export default memo(Title);

