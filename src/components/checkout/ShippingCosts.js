import { useState } from 'react';
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_SHIPPING_ADDRESS from "../../mutations/update-shipping-address";
import { UPDATE_SHIPPING_METHOD } from "../../mutations/update-shipping-method";
import Loading from "../icons/Loading";
import { isEmpty } from 'lodash';
import cx from 'classnames';

const ShippingSelection = ({
    cart,
    refetchCart,
    shippingAddress,
    loadingCart,
    setRequestError
}) => {

    const [
        shippingMethod,
        setShippingMethod
    ] = useState(cart?.shippingMethod ?? '');

    const requestDefaultOptions = {
        onCompleted: () => {
            console.log("completed, refetch");
            refetchCart('cart');
        },
        onError: (error) => {
            if (error) {
                const errorMessage = !isEmpty(error?.graphQLErrors?.[0])
                    ? error.graphQLErrors[0]?.message
                    : '';
                console.warn(error);
                if (setRequestError) {
                    setRequestError(errorMessage);
                }
            }
        }
    };

    // Update Customer Shipping Address for cart shipping calculations.
    const [updateShippingAddress, {
        data: updatedShippingData,
        loading: updatingShippinZipcode,
        error: updateShippingAddressError
    }] = useMutation(UPDATE_SHIPPING_ADDRESS, requestDefaultOptions);

    // Update Shipping Method.
    const [ShippingSelectionMethod, {
        data: chosenShippingData,
        loading: choosingShippingMethod,
        error: ShippingSelectionError
    }] = useMutation(UPDATE_SHIPPING_METHOD, requestDefaultOptions);

    const handleCalcShippingClick = async (event) => {
        // if (cart?.customer?.shipping.address1 != shippingAddress.address1
        //     || cart?.customer?.shipping.city != shippingAddress.city
        //     || cart?.customer?.shipping.state != shippingAddress.state
        //     || cart?.customer?.shipping.postcode != shippingAddress.postcode
        // ) {
        const { errors, ...shipping } = shippingAddress;
        console.log("update shipping add", shipping);
        updateShippingAddress({
            variables: {
                input: {
                    clientMutationId: v4(),
                    shipping,
                }
            },
        });
        // }
    };

    const handleShippingSelection = (event) => {
        const chosenShippingMethod = event.target.value;

        setShippingMethod(chosenShippingMethod);

        if (chosenShippingMethod != shippingMethod) {
            console.log("mutate shipping method", chosenShippingMethod, shippingMethod);
            ShippingSelectionMethod({
                variables: {
                    shippingMethod: {
                        clientMutationId: v4(),
                        shippingMethods: [chosenShippingMethod],
                    }
                },
            });

        };
    }
    console.log("shipping method", cart?.availableShippingMethods);
    return (
        <div className="choose-shipping-wrap flex-grow">
            {cart?.needsShippingAddress &&
                <>
                    <h2 className="mb-2 text-xl text-bold">Shipping Costs</h2>
                    <hr className="my-4 " />
                    {shippingAddress?.country && shippingAddress?.state && shippingAddress?.postcode &&
                        <div className="flex flex-wrap justify-between">
                            <div className="flex-grow">
                                {
                                    <>
                                        <button
                                            disabled={updatingShippinZipcode || loadingCart}
                                            type={"button"}
                                            onClick={handleCalcShippingClick}
                                            className={cx(
                                                'bg-purple-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full',
                                                { 'opacity-50': updatingShippinZipcode }
                                            )}
                                        >
                                            Update Shipping Costs
                                        </button>
                                        <p className="my-4 text-xs opacity-75">
                                            {shippingAddress.address1}
                                            - {shippingAddress.city}
                                            / {shippingAddress.state}
                                        </p>
                                    </>
                                }
                                {cart?.shippingMethods?.length
                                    && <div className='shipping-methods-wrap'>
                                        <div className='flex'>
                                            <h2 className="my-2 self-center text-xl text-bold">
                                                Choose Shipping Method
                                            </h2>
                                            {(updatingShippinZipcode || loadingCart) &&
                                                <Loading />
                                            }
                                        </div>
                                        <hr className="my-2" />
                                        {cart?.shippingMethods?.map(method => (
                                            <div key={method.id}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="chosenShippingMethod"
                                                        className="my-2"
                                                        disabled={updatingShippinZipcode}
                                                        value={method.id}
                                                        onChange={handleShippingSelection}
                                                        checked={shippingMethod == method.id}
                                                    /> {method.label} - {method.cost}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    )

};

export default ShippingSelection;
