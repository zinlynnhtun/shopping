import { Badge, BadgeText } from '@/components/ui/badge'
import { Box } from '@/components/ui/box'
import { Icon } from '@/components/ui/icon'
import { VStack } from '@/components/ui/vstack'
import useCartStore from '@/Store/cartStore'
import { ShoppingCart } from 'lucide-react-native'
import React, { memo } from 'react'

const Cart = () => {
    const totleItems = useCartStore((state) => state.getTotalItems())
    return (
        <Box className="items-center">
            <VStack>
                <Badge
                    className={`z-10 self-end ${totleItems > 9 ? " h-[20px] w-[28px]" : " h-[20px] w-[20px]"} bg-red-600 rounded-full -mb-3.5 -mr-3.5`}
                    variant="solid"
                >
                    <BadgeText className="text-white">{totleItems}</BadgeText>
                </Badge>
                <Icon
                    as={ShoppingCart}
                    className="text-gray-800"
                    size='xl'></Icon>
            </VStack>
        </Box>
    )
}

export default memo(Cart)

