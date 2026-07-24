// NOTE: inputs are validated in components

import { z } from 'zod';

import syncToken from './syncToken';

import {
  CityGetSchema,
  type CityPostAndPut,
  CitySchema,
  DistrictGetSchema,
  type DistrictPostAndPut,
  DistrictSchema,
  type EquipmentPostAndPut,
  EquipmentSchema,
  GymEquipmentSchema,
  type GymFrontendPostAndPut,
  GymGetEquipmentSchema,
  GymGetMembershipsSchema,
  GymGetSchema,
  GymSchema,
  type MembershipPostAndPut,
  MembershipSchema
} from '@strength-inventory/schemas';

export const baseUrl
  = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

interface TokenValidationProps {
  refresh: () => Promise<string>
  logout: () => Promise<void>
}


// gyms

export const getGyms = async () => {
  const res = await fetch(`${baseUrl}/gyms`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetSchema).parse(data);
  return validatedData;
};

export const getGymsIdAndName = async () => {
  const res = await fetch(`${baseUrl}/gyms`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetSchema).parse(data);
  return validatedData.map(({ id, name }) => ({ id, name }));
};

export const getGym = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = GymGetSchema.parse(data);
  return validatedData;
};

export const getGymEquipment = async ({ gymId }: { gymId: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetEquipmentSchema).parse(data);
  return validatedData;
};

export const getGymMemberships = async ({ gymId }: { gymId: string }) => {
  const res = await fetch(`${baseUrl}/gyms/${gymId}/memberships`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(GymGetMembershipsSchema).parse(data);
  return validatedData;
};

interface PostGymProps extends TokenValidationProps {
  gym: GymFrontendPostAndPut
}

export const postGym = async ({ gym, refresh, logout }: PostGymProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify(gym),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymSchema.parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface postGymEquipmentProps extends TokenValidationProps {
  gymId: string
  equipmentId: string
  count: number
}

export const postGymEquipment = async (
  { gymId, equipmentId, count, refresh, logout }: postGymEquipmentProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ equipmentId: equipmentId, count: count }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.object({
      gymId: z.uuidv4(), equipmentId: z.uuidv4()
    }).parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface GymMembershipProps extends TokenValidationProps {
  gymId: string
  membershipId: string
}

export const postGymMembership = async (
  { gymId, membershipId, refresh, logout }: GymMembershipProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/memberships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ membershipId: membershipId }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.object({
      gymId: z.uuidv4(), membershipId: z.uuidv4()
    }).parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface putGymProps extends TokenValidationProps {
  id: string
  gym: GymFrontendPostAndPut
}

export const putGym
  = async ({ id, gym, refresh, logout }: putGymProps) => {
  /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/gyms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(gym),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = GymSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

interface setEquipmentCountProps extends TokenValidationProps {
  relationshipId: string
  count: number
}

export const setGymEquipmentCount = async (
  { relationshipId, count, refresh, logout }: setEquipmentCountProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gymequipment/${relationshipId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ count: count }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = GymEquipmentSchema.parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface deleteItemProps extends TokenValidationProps {
  id: string
}

export const deleteGym = async ({ id, refresh, logout }: deleteItemProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`
      },
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('Login expired.');
  }
};

interface DeleteGymEquipmentProps extends TokenValidationProps {
  gymId: string
  equipmentId: string
}

export const deleteGymEquipment = async (
  { gymId, equipmentId, refresh, logout }: DeleteGymEquipmentProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/equipment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ equipmentId: equipmentId }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.object({
      gymId: z.uuidv4(), equipmentId: z.uuidv4()
    }).parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

export const deleteGymMembership = async (
  { gymId, membershipId, refresh, logout }: GymMembershipProps
) => {
  /* only admins and managers have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/gyms/${gymId}/memberships`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ membershipId: membershipId }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.object({
      gymId: z.uuidv4(), membershipId: z.uuidv4()
    }).parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};


// equipment

export const getEquipment = async () => {
  const res = await fetch(`${baseUrl}/equipment`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(EquipmentSchema).parse(data);
  return validatedData;
};

export const getPiece = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/equipment/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = EquipmentSchema.parse(data);
  return validatedData;
};

interface postEquipmentProps extends TokenValidationProps {
  piece: EquipmentPostAndPut
}

export const postEquipment
  = async ({ piece, refresh, logout }: postEquipmentProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(piece),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = EquipmentSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

interface putEquipmentProps extends TokenValidationProps {
  id: string
  piece: EquipmentPostAndPut
}

export const putEquipment
  = async ({ id, piece, refresh, logout }: putEquipmentProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(piece),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = EquipmentSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

export const deleteEquipment
  = async ({ id, refresh, logout }: deleteItemProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/equipment/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `bearer ${token}`
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }
    } else {
      throw Error('Login expired.');
    }
  };


// memberships

export const getMembershipsByCountry
  = async ({ country }: { country: string }) => {
    const res = await fetch(`${baseUrl}/memberships/country/${country}`);
    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = z.array(MembershipSchema).parse(data);
    return validatedData;
  };

export const getMembership = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/memberships/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = MembershipSchema.parse(data);
  return validatedData;
};

interface postMembershipProps extends TokenValidationProps {
  membership: MembershipPostAndPut
}

export const postMembership
  = async ({ membership, refresh, logout }: postMembershipProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/memberships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(membership),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = MembershipSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

interface putMembershipProps extends TokenValidationProps {
  id: string
  membership: MembershipPostAndPut
}

export const putMembership
  = async ({ id, membership, refresh, logout }: putMembershipProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/memberships/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(membership),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = MembershipSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

export const deleteMembership
  = async ({ id, refresh, logout }: deleteItemProps) => {
    /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/memberships/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `bearer ${token}`
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }
    } else {
      throw Error('Login expired.');
    }
  };


// cities

export const getCities = async () => {
  const res = await fetch(`${baseUrl}/cities`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(CityGetSchema).parse(data);
  return validatedData;
};

export const getCity = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/cities/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = CityGetSchema.parse(data);
  return validatedData;
};

interface postCityProps extends TokenValidationProps {
  city: CityPostAndPut
}

export const postCity = async ({ city, refresh, logout }: postCityProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify(city),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = CitySchema.parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface putCityProps extends TokenValidationProps {
  id: string
  city: CityPostAndPut
}

export const putCity
  = async ({ id, city, refresh, logout }: putCityProps) => {
  /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(city),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = CitySchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

export const deleteCity = async ({ id, refresh, logout }: deleteItemProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/cities/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`
      },
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('Login expired.');
  }
};


// districts

export const getDistricts = async () => {
  const res = await fetch(`${baseUrl}/districts`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = z.array(DistrictGetSchema).parse(data);
  return validatedData;
};

export const getDistrict = async ({ id }: { id: string }) => {
  const res = await fetch(`${baseUrl}/districts/${id}`);
  if (!res.ok) {
    throw Error(`Response status: ${res.statusText}`);
  }

  const data: unknown = await res.json();
  const validatedData = DistrictGetSchema.parse(data);
  return validatedData;
};

interface postDistrictProps extends TokenValidationProps {
  district: DistrictPostAndPut
}

export const postDistrict = async ({
  district, refresh, logout
}: postDistrictProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/districts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify(district),
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    const validatedData = DistrictSchema.parse(data);
    return validatedData;
  } else {
    throw Error('Login expired.');
  }
};

interface putDistrictProps extends TokenValidationProps {
  id: string
  district: DistrictPostAndPut
}

export const putDistrict
  = async ({ id, district, refresh, logout }: putDistrictProps) => {
  /* only admins have permission */
    const token = await syncToken({ refresh, logout });
    if (token) {
      const res = await fetch(`${baseUrl}/districts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify(district),
        credentials: 'include'
      });

      if (!res.ok) {
        throw Error(`Response status: ${res.statusText}`);
      }

      const data: unknown = await res.json();
      const validatedData = DistrictSchema.parse(data);
      return validatedData;
    } else {
      throw Error('Login expired.');
    }
  };

export const deleteDistrict = async ({
  id, refresh, logout
}: deleteItemProps) => {
  /* only admins have permission */
  const token = await syncToken({ refresh, logout });
  if (token) {
    const res = await fetch(`${baseUrl}/districts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`
      },
      credentials: 'include'
    });

    if (!res.ok) {
      throw Error(`Response status: ${res.statusText}`);
    }
  } else {
    throw Error('Login expired.');
  }
};
