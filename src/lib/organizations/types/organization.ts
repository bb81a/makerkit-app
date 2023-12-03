interface Organization {
  id: number;
  uuid: string;
  name: string;
  timezone?: string;
  logoURL?: string | null;
}

export default Organization;
