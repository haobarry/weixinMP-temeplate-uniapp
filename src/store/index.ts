/**
 * 🍍pinia
 */

import usersStoreModule from "./modules/users";
import authStoreModule from "./modules/auth";
import procurementOrdersModule from "./modules/procurementOrders";

export function useStores() {
  return {
    authStore: authStoreModule(),
    usersStore: usersStoreModule(),
    procurementOrdersStore: procurementOrdersModule(),
  };
}
