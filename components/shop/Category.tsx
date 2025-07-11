import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { IMG_URL } from "@/config/index";
import type { CategoryType } from "@/types";
import { Image } from 'expo-image';
import React from 'react';
const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

interface CategoryProps extends CategoryType {
    onselect: (id: number) => void;
    selected?: number;
}

const Category = ({ id, name, image, onselect, selected }: CategoryProps) => {
    return (
        <Pressable onPress={() => onselect(id)}>
            <Card className="items-center">
                <Image
                    style={[{ width: 56, height: 56, marginBottom: 8, borderRadius: 10 }, selected === id && { borderColor: 'gold', borderWidth: 2, borderRadius: 28 }]}
                    source={IMG_URL + image}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                />
                <Text size="sm" className="text-center mt-2 font-medium text-black">
                    {name}
                </Text>
            </Card>
        </Pressable>
    )
}

export default Category

