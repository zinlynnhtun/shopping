import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { IMG_URL } from "@/config/index";
import type { ProductType } from "@/types";
import { Image } from 'expo-image';
import { Heart, StarIcon } from "lucide-react-native";
interface ProductProps extends ProductType {

    oncallRoute: (id: number) => void;
    toogleFav: (productId: number, favourite: boolean) => void
}


const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Product = ({ id, brand, title, price, discount, image, star, oncallRoute, quantity, description, users, toogleFav }: ProductProps) => {
    // const [favorite, setFavorite] = useState(false);
    return (
        <Pressable className='flex-1' onPress={() => oncallRoute(id)}>

            <Card className="relative ">
                <Image
                    style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: 10 }}
                    source={IMG_URL + image}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                />
                <Pressable onPress={() => toogleFav(id, users.length === 0)} className="rounded-full bg-zinc-300/40 absolute top-4 right-4 p-3">
                    <Icon as={Heart} className={`text-red-500 ${users.length > 0 && 'fill-red-400'}`} size="lg" />
                </Pressable>

                <VStack space="xs" className="mt-3">
                    <HStack space="sm" className="items-center">
                        <Text className="font-semibold text-gray-600"> {brand}</Text>
                        <Icon as={StarIcon} color="#f97316" size="xs" />
                        <Text className="text-gray-500" size="xs">{quantity}</Text>
                    </HStack>
                    <Text className="line-clamp-1 font-medium">{title}</Text>
                    <HStack space="xs" className="items-center">
                        <Text className={discount > 0 ? 'text-gray-500 line-through' : 'text-gray-500 '}>${(price + discount).toFixed(2)}</Text>
                        {discount > 0 && (
                            <Text className="text-green-500 font-semibold">${(price).toFixed(2)}</Text>
                        )}

                    </HStack>
                </VStack>

            </Card>
        </Pressable>
    )
}

export default Product

