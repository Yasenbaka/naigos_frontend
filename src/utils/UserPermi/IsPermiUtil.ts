export const hasPermission = (userPermission: number, target: number): boolean => (userPermission & target) != 0;