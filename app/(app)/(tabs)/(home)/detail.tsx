import api from '@/api/axios';
import Cart from '@/components/shop/Cart';
import Pager from '@/components/shop/Pager';
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper
} from "@/components/ui/actionsheet";
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
    Checkbox,
    CheckboxGroup,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from "@/components/ui/checkbox";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from '@/components/ui/hstack';
import {
    AddIcon, CheckIcon,
    CloseCircleIcon,
    CloseIcon,
    HelpCircleIcon,
    Icon,
    RemoveIcon
} from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from "@/components/ui/toast";
import { VStack } from '@/components/ui/vstack';
import useCartStore from '@/Store/cartStore';
import type { ProductType } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Heart, StarIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
type CartItem = {
    id: number;
    quantity: number;
    color: string;
    size: string;
};

const fetchProduct = async (productId: number): Promise<ProductType> => {
    const response = await api.get(`/api/v1/users/products/${productId}`)
    console.log(response.data.users)
    return response.data
}

const Detail = () => {
    const { id } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const { addToCart } = useCartStore();
    const { data: product, isLoading, error, refetch } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(+id),
        // staleTime: 1000 * 60
    })
    //const product = products.find(item => item.id === +id);
    const [color, setColor] = useState([])
    const [size, setsize] = useState([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [quantity, setquantity] = useState(1)
    const [showActionsheet, setShowActionsheet] = useState(false)
    const handleClose = () => {
        setShowActionsheet(false)
        color.forEach((c) => {
            size.forEach((s) => {
                setCart((prev) => [{ id: Math.random(), color: c, size: s, quantity: quantity }, ...prev]);
            });
        })

        setColor([])
        setsize([])
        setquantity(1)

    }
    const toast = useToast()
    const [toastId, setToastId] = React.useState(0)
    const handleToast = () => {
        if (!toast.isActive(toastId.toString())) {
            showNewToast()
        }
    }
    const showNewToast = () => {
        const newId = Math.random()
        setToastId(newId)
        toast.show({
            id: newId.toString(),
            placement: "bottom",
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id
                return (
                    <Toast
                        action="error"
                        variant="outline"
                        nativeID={uniqueToastId}
                        className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
                    >
                        <HStack space="md">
                            <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" />
                            <VStack space="xs">
                                <ToastTitle className="font-semibold text-error-500">
                                    {`Your Must Choose ${color.length === 0 ? 'Color' : ''} ${size.length === 0 ? 'Size' : ''} !`}
                                </ToastTitle>
                                <ToastDescription size="sm">
                                    Please choose at least one color and one size!
                                </ToastDescription>
                            </VStack>
                        </HStack>
                        <HStack className="min-[450px]:gap-3 gap-1">
                            <Pressable onPress={() => toast.close(id)}>
                                <Icon as={CloseIcon} />
                            </Pressable>
                        </HStack>
                    </Toast>
                )
            },
        })
    }

    const addCartToStore = () => {
        if (cart.length === 0) {
            return handleToast()
        }

        const cartProduct = {
            id: product?.id!,
            title: product?.title!,
            price: product?.price!,
            image: product?.image,
            items: cart
        }
        addToCart(cartProduct)
        router.back()
    }
    if (isLoading) {
        return (
            <VStack className='flex-1 items-center justify-center'>
                <Text>Loading ... ......</Text>
            </VStack>
        )
    }
    if (error) {

        return (
            <VStack className='flex-1 items-center justify-center'>
                <Text className='m-4'>Error : {error?.message}</Text>
                <Button size='md' variant='solid' action='negative' onPress={() => {
                    refetch()
                    // productsRefresh()
                    // console.log(232);
                }}>
                    <ButtonText>Retry</ButtonText>
                </Button>
            </VStack>
        )
    }
    return (

        <VStack space='md' className='flex-1  bg-slate-200'>
            <Stack.Screen
                options={{
                    title: "Product Detail",
                    headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
                    headerShadowVisible: false,
                    headerBackTitle: 'Home',
                    headerRight: () => (
                        <Pressable className='pe-5' >
                            <Cart />
                        </Pressable>
                    ), // Hide the right header button
                }}
            />
            <Pager />
            <ScrollView>
                <VStack space='md' className='px-4 pt-4'>
                    <HStack className='justify-between'>
                        <HStack space="sm" className="items-center">
                            <Text className="font-semibold text-gray-600"> {product?.brand}</Text>
                            <Icon as={StarIcon} color="#f97316" size="xs" />
                            <Text className="text-gray-500" size="xs">{product?.quantity}</Text>
                        </HStack>
                        <Pressable>
                            <Icon as={Heart} className={`text-red-500 ${product!.users.length > 0 && 'fill-red-400'}`} size="lg" />
                        </Pressable>
                    </HStack>
                    <Text className="line-clamp-1 font-medium">{product?.title}</Text>
                    <HStack space="xs" className="items-center">
                        <Text className={product?.discount! > 0 ? 'text-gray-500 line-through' : 'text-gray-500 '}>${(product?.price! + product?.discount!).toFixed(2)}</Text>
                        {product?.discount! > 0 && (
                            <Text className="text-green-500 font-semibold">${(product?.price!).toFixed(2)}</Text>
                        )}
                    </HStack>
                    <Text className='text-gray-600 font-semibold'>{product?.description}</Text>
                    <Text className='text-gray-600 font-semibold text-lg'> Choose Colors</Text>
                    <CheckboxGroup
                        value={color}
                        onChange={(keys) => {
                            setColor(keys)
                        }}
                    >
                        <HStack space="2xl" className='flex-wrap'>
                            {
                                product?.colors.map((item, index) => (


                                    <Checkbox
                                        key={index}
                                        value={item.color.name}
                                    // className='w-10 h-10 rounded-full '
                                    // style={{
                                    //     backgroundColor: item.bgColor,
                                    // }}
                                    >
                                        <CheckboxIndicator>
                                            <CheckboxIcon as={CheckIcon} />
                                        </CheckboxIndicator>
                                        <CheckboxLabel>{item.color.name}</CheckboxLabel>
                                    </Checkbox>
                                ))
                            }

                        </HStack>
                    </CheckboxGroup>
                    <Text className='text-gray-600 font-semibold text-lg'> Choose Size</Text>
                    <CheckboxGroup
                        value={size}
                        onChange={(keys) => {
                            setsize(keys)
                        }}
                    >
                        <HStack space="2xl" className='flex-wrap'>
                            {
                                product?.sizes.map((item, index) => (


                                    <Checkbox
                                        key={index}
                                        value={item.size.name}
                                    // className='w-10 h-10 rounded-full '
                                    // style={{
                                    //     backgroundColor: item.bgColor,
                                    // }}
                                    >
                                        <CheckboxIndicator>
                                            <CheckboxIcon as={CheckIcon} />
                                        </CheckboxIndicator>
                                        <CheckboxLabel>{item.size.name}</CheckboxLabel>
                                    </Checkbox>
                                ))
                            }

                        </HStack>
                    </CheckboxGroup>
                    <Box className='mt-6 self-start'>
                        <Button size='lg' className=' bg-sky-500 rounded-lg' onPress={() => {
                            if (color.length === 0 || size.length === 0) {
                                handleToast()
                                return
                            }
                            setShowActionsheet(true)
                        }}>
                            <ButtonText>Set Quentity</ButtonText>
                        </Button>
                    </Box>
                    {cart.length > 0 && (
                        <VStack space='md' className='mt-6'>
                            <Text className='text-gray-600 font-semibold text-lg'> Cart Items</Text>
                            {cart.map((item, index) => (
                                <HStack key={index} className='justify-between items-center bg-slate-100 px-2 py-1 rounded-lg '>
                                    <HStack space='md' className='items-center'>
                                        <Icon as={AddIcon} size='sm'></Icon>
                                        <Text className='text-gray-600 font-semibold'>{item.color}</Text>
                                        <Text className='text-gray-600 font-semibold'>{item.size}</Text>
                                        <Text className='text-gray-600 font-semibold'>({item.quantity})</Text>
                                    </HStack>


                                    <Button
                                        size='sm'
                                        variant='link'
                                        className='rounded-lg'
                                        onPress={() => {
                                            setCart(prev => prev.filter(cartItem => cartItem.id !== item.id))
                                        }}
                                    >
                                        <ButtonIcon as={CloseCircleIcon} />
                                    </Button>

                                </HStack>
                            ))}
                        </VStack>
                    )}
                </VStack>
                <Box className='mb-48'></Box>
            </ScrollView>
            <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    {/* <ActionsheetItem>
                        <ActionsheetIcon className="stroke-background-700" as={EditIcon} />
                        <ActionsheetItemText>Edit Message</ActionsheetItemText>
                    </ActionsheetItem> */}
                    <VStack className='w-full justify-center items-center' space='md'>
                        <Text className='text-gray-600 font-semibold text-lg'> Choose Your Colors and Size</Text>
                        <Text >{color.join(", ")} - {size.join(", ")}</Text>
                        <Text bold>Please Set Quantity</Text>
                        <Text className='text-gray-600 font-semibold  my-2' size='5xl'> {quantity}</Text>
                        <HStack space='md' className='w-full justify-center items-center'>
                            <Button
                                size='lg'
                                className='bg-sky-500 rounded-lg flex-1'
                                onPress={() => {
                                    if (quantity > 1) {
                                        setquantity(p => p - 1)
                                    }
                                }}
                            >
                                <ButtonIcon as={RemoveIcon}></ButtonIcon>
                                <ButtonText>Decrease</ButtonText>
                            </Button>
                            <Button
                                size='lg'
                                className='bg-sky-500 rounded-lg flex-1'
                                onPress={() => {
                                    setquantity(p => p + 1)
                                }}
                            >
                                <ButtonIcon as={AddIcon}></ButtonIcon>
                                <ButtonText>Increase</ButtonText>
                            </Button>
                        </HStack>
                        <Button className='rounded-lg bg-green-500 w-full' onPress={() => {
                            handleClose()
                        }}>
                            <ButtonText className='text-white font-semibold flex-1 text-center' >Confirm</ButtonText>
                        </Button>
                    </VStack>

                </ActionsheetContent>
            </Actionsheet>
            <Box className="self-end">
                <Fab
                    size="md"
                    placement="bottom right"
                    className='bottom-28 bg-green-500'
                    // isHovered={false}
                    // isDisabled={false}
                    // isPressed={false}
                    onPress={addCartToStore}
                >
                    <FabIcon as={AddIcon} size='md' />
                    <FabLabel bold>Add to Cart</FabLabel>
                </Fab>
            </Box>
            {/* < Text > detail{id} {product?.description}</Text > */}
        </VStack >
    )
}

export default Detail