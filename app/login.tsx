import { Button, ButtonText } from '@/components/ui/button';


import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Image } from '@/components/ui/image';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/provider/ctx';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function SignIn() {
    const {
        signIn
    } = useSession();
    const [showPassword, setShowPassword] = React.useState(false);
    const handleState = () => {
        setShowPassword(showState => {
            return !showState;
        });
    };
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            phone: "",
            password: "",
        },
    })
    const onSubmit = async (formState: any) => {
        // console.log(formState)
        await signIn(formState)
        router.replace("/");
    }

    return <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'ghostwhite'
    }}>
        <ScrollView showsVerticalScrollIndicator={false} className='p-2'>
            <HStack className="mt-2 justify-end me-5 items-center" space="md">
                <Image size="xs" alt='this' source={require("@/assets/images/shop/shop1.webp")} className='rounded-lg' />
                <Text size='sm' bold className='text-center'>shopping</Text>
            </HStack>
            <VStack space='3xl' className='ms-3'>
                <VStack space='md'>
                    <Heading size={"3xl"} bold className='leading-normal'>
                        Sign In {"\n"}to your account
                    </Heading>
                    <Text size='lg' className='text-gray-900 font-weight-semibold'>
                        Please sign in to continue to your account.
                    </Text>
                </VStack>

                <FormControl
                    // isInvalid={isInvalid}
                    size="md"
                // isDisabled={false}
                // isReadOnly={false}
                // isRequired={false}
                >
                    <VStack space='md'>
                        <FormControlLabel>
                            <FormControlLabelText className='text-lg font-semibold'>Phone Number</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "This is required.",
                                },
                                minLength: {
                                    value: 7,
                                    message: "This is not phone number.",
                                },
                                pattern: {
                                    value: /^\d*$/,
                                    message: "Please enter digits only.",

                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input className=" h-16 rounded-lg border-gray-400 bg-white" size='xl'>
                                    <InputField
                                        //type="password"
                                        placeholder="098xxxxxxx"
                                        onBlur={onBlur}
                                        value={value}
                                        onChangeText={onChange}
                                        inputMode='numeric' maxLength={11} />
                                </Input>
                            )}
                            name="phone"
                        />
                        {errors.phone && <Text className='text-red-500 ' size='md'>{errors.phone.message}</Text>}

                        <FormControlLabel>
                            <FormControlLabelText className='text-lg font-semibold'>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "This is required.",
                                },
                                minLength: {
                                    value: 6,
                                    message: "Atleast 6 characters are required.",
                                },

                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input className=" h-16 rounded-lg border-gray-400 bg-white" size={"xl"}>
                                    <InputField type={showPassword ? "text" : "password"} placeholder="*********"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                    <InputSlot className="pr-3" onPress={handleState}>
                                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                </Input>
                            )}
                            name="password"
                        />
                        {errors.password && <Text className='text-red-500'>{errors.password.message}</Text>}


                        <FormControlHelper>
                            <FormControlHelperText className='text-sm text-gray-500'>
                                Must be atleast 6 characters.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>
                                Atleast 6 characters are required.
                            </FormControlErrorText>
                        </FormControlError>
                    </VStack>
                </FormControl>
                <Text size='md' className='text-blue-500 font-semibold text-right me-2'>
                    Forgot Password?
                </Text>
                <Button className='rounded-lg bg-blue-500 h-16' onPress={handleSubmit(onSubmit)}>
                    <ButtonText className='text-lg font-semibold'>Sign In</ButtonText>
                </Button>
            </VStack>
        </ScrollView>
    </SafeAreaView>;
}