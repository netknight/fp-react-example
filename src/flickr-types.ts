export type FMedia = {
  readonly m: string;
}

export type FItem = {
  readonly media: FMedia;
}

export type FResponse = {
  readonly description: string;
  readonly generator: string;
  readonly items: Array<FItem>;
  readonly link: string;
  readonly modified: string;
  readonly title: string;
}
