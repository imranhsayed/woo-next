import { useState } from 'react';
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_SHIPPING_ADDRESS from "../../mutations/update-shipping-address";
import { UPDATE_SHIPPING_METHOD } from "../../mutations/update-shipping-method";
import LoadingImg from "../LoadingImg";
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { formatCurrency } from "../../functions";

const ShippingSelection = ({
    cart,
    refetchCart,
    shippingAddress,
    loadingCart,
    validateFields,
}) => {

    const [
        shippingMethod,
        setShippingMethod
    ] = useState(cart?.shippingMethod ?? '');

    const [requestError, setRequestError] = useState(null);

    const requestDefaultOptions = {
        onCompleted: () => {
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
        loading: updatingShippingAddress,
        error: updateShippingAddressError
    }] = useMutation(UPDATE_SHIPPING_ADDRESS, requestDefaultOptions);

    // Update Shipping Method.
    const [ShippingSelectionMethod, {
        data: chosenShippingData,
        loading: choosingShippingMethod,
        error: ShippingSelectionError
    }] = useMutation(UPDATE_SHIPPING_METHOD, requestDefaultOptions);

    const handleCalcShippingClick = async (event) => {

        setRequestError("");
        if (!validateFields()) {
            setRequestError('Please fill out all required shipping fields to calculate shipping costs.');
            return;
        }

        const {
            errors,
            createAccount,
            orderNotes,
            ...shipping
        } = shippingAddress;

        updateShippingAddress({
            variables: {
                input: {
                    clientMutationId: v4(),
                    shipping,
                }
            },
        });
    };

    const handleShippingSelection = (event) => {
        const chosenShippingMethod = event.target.value;

        setShippingMethod(chosenShippingMethod);

        if (chosenShippingMethod != shippingMethod) {
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

    const isLoading = updatingShippingAddress
        || choosingShippingMethod
        || loadingCart;

    return (
        <div
            className={cx(
                'choose-shipping-wrap flex-grow',
                { 'opacity-50': isLoading }
            )}
        >
            {cart?.needsShippingAddress &&
                <>
                    <h2 className="mb-2 text-xl text-bold">Shipping Costs</h2>
                    <hr className="my-4 " />
                    <div className="flex flex-wrap justify-between">
                        <div className="flex-grow">
                            {
                                <>
                                    <button
                                        disabled={isLoading}
                                        type={"button"}
                                        onClick={handleCalcShippingClick}
                                        className={cx(
                                            'bg-purple-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full',
                                            { 'opacity-50': isLoading }
                                        )}
                                    >
                                        Update Shipping Costs
                                    </button>
                                    {isLoading &&
                                        <LoadingImg />
                                    }
                                    {requestError
                                        ? <p className="my-4 text-red-600">{requestError}</p>
                                        : <p className="my-4 text-xs opacity-75">
                                            {
                                                [
                                                    cart?.customer?.shipping?.address1,
                                                    cart?.customer?.shipping?.city,
                                                    cart?.customer?.shipping?.state
                                                ].filter(val => val).join(' - ')
                                            }
                                        </p>
                                    }
                                </>
                            }
                            {cart?.customer?.shipping?.country
                                && cart?.customer?.shipping?.state
                                && cart?.customer?.shipping?.postcode
                                && cart?.shippingMethods?.length
                                && <div className='shipping-methods-wrap'>
                                    <div className='flex'>
                                        <h2 className="my-2 self-center text-xl text-bold">
                                            Choose Shipping Method
                                        </h2>
                                    </div>
                                    <hr className="my-2" />
                                    {cart?.shippingMethods?.map(method => (
                                        <div key={method.id}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="chosenShippingMethod"
                                                    className="my-2"
                                                    disabled={isLoading}
                                                    value={method.id}
                                                    onChange={handleShippingSelection}
                                                    checked={shippingMethod == method.id}
                                                /> {method.label} - {formatCurrency(method.cost)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                    <table className="mt-4 checkout-cart table table-hover w-full mb-10">
                        <tbody>
                            <tr className="bg-gray-200">
                                <td className="w-24" />
                                <td className="woo-next-checkout-total font-normal ">Shipping</td>
                                <td className="woo-next-checkout-total font-bold ">{formatCurrency(cart.shippingTotal)}</td>
                            </tr>
                            <tr className="bg-gray-200">
                                <td className="" />
                                <td className="woo-next-checkout-total font-normal text-xl">Total</td>
                                <td className="woo-next-checkout-total font-bold text-xl">{cart.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            }
        </div>
    )

};

export default ShippingSelection;
