import { useCss } from '@mantine/core';
import type { MessageBuffer, UserChatEventData } from 'golden-hammer-shared';
import { cloneElement } from 'react';
import type { EntryViewProps } from '../EventEntryFactory.js';

const buildMessageChunk = (chunk: MessageBuffer) => {
  switch (chunk.type) {
    case 'word':
      return <span>{chunk.content}</span>;
    case 'uri':
      return (
        <a href={chunk.content} target="_blank">
          {chunk.content}
        </a>
      );
    case 'emote':
      return <img src={chunk.meta?.uri} className="emote" />;
  }
};

export default function UserChatEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element {
  const { cx } = useCss();

  let retElement: JSX.Element;

  const data: UserChatEventData = normalizedEvent.eventData as UserChatEventData;
  const prefix = <span className="userName">{data.userName}:</span>;

  switch (normalizedEvent.eventClassification) {
    case 'UserChat.Presence':
      retElement = (
        <span>
          {prefix} {data.presence}ed the Chat.
        </span>
      );
      break;

    case 'UserChat.Message':
      {
        const children =
          data.messageBuffers?.map(buildMessageChunk).reduce((c: JSX.Element[], chunkChild, idx, arr) => {
            c.push(chunkChild);

            if (idx <= arr.length) {
              c.push(<span> </span>);
            }

            return c;
          }, []) ?? [];

        retElement = (
          <span className={cx({ 'removed-content': normalizedEvent.isRemoved })}>
            {prefix} {children.map((c, key) => cloneElement(c, { key }))}
          </span>
        );
      }
      break;
    default:
      retElement = <></>;
  }

  return retElement;
}
