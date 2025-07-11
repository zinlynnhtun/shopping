import api from '@/api/axios';
import Cart from '@/components/shop/Cart';
import Category from '@/components/shop/Category';
import Product from '@/components/shop/Product';
import Title from '@/components/shop/Title';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
// import { categories, products } from "@/data/index";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from '@/components/ui/text';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { CategoryType, ProductType } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowUpRightIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const fetchCatrories = async (): Promise<CategoryType[]> => {
  const response = await api.get("/api/v1/users/categories")
  // console.log(response.status)
  return response.data;
}
interface ProductApiResponse {
  products: ProductType[];
  [key: string]: any

}
const fetchProducts = async (selectedCategory = 1): Promise<ProductApiResponse> => {

  const response = await api.get(`/api/v1/users/products?limit=8&category=${selectedCategory}`)
  console.log(selectedCategory)
  return response.data;
}
const FavToggles = async ({ productId, favourite }: { productId: number, favourite: boolean }) => {

  const response = await api.patch("/api/v1/users/products/favourite-toggle", {
    productId,
    favourite
  })
  console.log(response.data)
  return response.data;
}

export default function HomeScreen() {

  const [selectedCategory, setSelectedCategory] = useState(1);

  const handleCategorySelect = useCallback((id: number) => {

    setSelectedCategory(id);
  }, []);

  const width = Dimensions.get('screen').width;

  const numColoum = width < 600 ? 2 : width < 786 ? 3 : 4;
  const queryClient = useQueryClient();

  const { data: categories, isLoading: categoriesLoading, error: categoriesError, refetch: categoriesRefetch } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCatrories,
  })
  const { data, isLoading: productsLoading, error: productsError, refetch: productsRefresh } = useQuery({

    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
    staleTime: 5 * 60 * 1000
  })


  useEffect(() => {
    if (categories) {
      setSelectedCategory(categories[0].id)
    }
  }, [categories])


  const toogleFavMutation = useMutation({
    mutationFn: FavToggles,
    onMutate: async ({ productId, favourite }) => {
      await queryClient.cancelQueries({ queryKey: ["products", selectedCategory] })

      const previousProducts = queryClient.getQueryData(["products", selectedCategory])

      queryClient.setQueryData(["products", selectedCategory], (oldData: any) => {
        if (oldData) return oldData

        const favouriteData = favourite ? [{ id: 1 }] : [];
        return {
          ...oldData,
          products: oldData.products.map((product: any) => product.id === productId ? { ...product, users: favouriteData } : product)
        }
      })

      return { previousProducts }
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData(["products", selectedCategory], context?.previousProducts)
      handleToast("error occours", error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", selectedCategory] })
      queryClient.invalidateQueries({ queryKey: ["product"] })
    }
  })

  const handleToogleFav = (productId: number, favourite: boolean) => {
    toogleFavMutation.mutate({ productId, favourite })
  }

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


  const goDetail = () => (id: number) => {
    console.log('Go to detail with id:', id);
    // Here you can navigate to the detail screen with the product id
    router.navigate({ pathname: '/detail', params: { id } });
  };
  const toast = useToast()
  const [toastId, setToastId] = React.useState(0)
  const handleToast = (title: string, description: string) => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast(title, description)
    }
  }
  const showNewToast = useCallback((title: string, description: string) => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast nativeID={uniqueToastId} action="info" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>
              {description}
            </ToastDescription>
          </Toast>
        )
      },
    })
  }, [])

  if (categoriesError || productsError) {
    return (
      <Box className='flex-1 justify-center items-center'>
        <Text className='m-4'>Error : {categoriesError?.message || productsError?.message}</Text>
        <Button size='md' variant='solid' action='primary' onPress={() => {
          categoriesRefetch()
          productsRefresh()
          // console.log(232);
        }}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    )
  }
  return <SafeAreaView style={{
    flex: 1,
    backgroundColor: 'white'
  }}>

    <HStack className="m-2 justify-between items-center" space={"lg"}>
      <Pressable>
        <Image
          style={{ width: 33, height: 33, borderRadius: 10 }}
          source={require('@/assets/images/shop/shop1.webp')}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </Pressable>
      <Pressable className='pe-5'>
        <Cart />
      </Pressable>
    </HStack>
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <Image
        style={{ width: "100%", aspectRatio: 20 / 9 }}
        source={require('@/assets/images/shop/banner6.jpg')}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <Box className='px-4 mt-2 pb-40'>
        <Title title={'Shop By Category'} actionText='See all' />
        {!categoriesLoading ? (<FlashList
          data={categories}
          extraData={selectedCategory}
          horizontal
          estimatedItemSize={60}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Category {...item} onselect={handleCategorySelect} selected={selectedCategory} />
          )}
        />) : (
          <HStack className='my-4 gap-4 align-middle'>
            {
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="circular" className="h-[24px] w-[24px] mr-2" />
              ))
            }

          </HStack>
        )}

        <Title title={'Recommend For you '} actionText='See all' />
        if (!productsLoading && (
        <FlashList
          data={data?.products}
          estimatedItemSize={100}
          numColumns={numColoum}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item, index }) => (
            <Product oncallRoute={goDetail()} {...item} toogleFav={handleToogleFav} />
          )}
        />
        ) )
        {!productsLoading && data?.products.length == 0 && (
          <Box className='mt-4 w-full items-center justify-center rounded-lg'>
            <Text>Empty</Text>
          </Box>
        )}
        if (!productsLoading && (
        <Button className='mt-5 h-14 w-[120px] rounded-full bg-blue-500  mx-auto'>
          <ButtonIcon as={ArrowUpRightIcon}></ButtonIcon>
        </Button>
        ))

      </Box>
    </ScrollView>
  </SafeAreaView>;
}