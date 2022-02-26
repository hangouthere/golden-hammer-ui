import type { UserChatEventData } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../panel/EventEntryFactory';

const buildMessageChunk = (chunk: UserChatEventData.MessageBuffer) => {
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
  const data: UserChatEventData = normalizedEvent.eventData as UserChatEventData;

  const prefix = <span className="userName">{data.userName}:</span>;

  let retElement: JSX.Element;

  switch (normalizedEvent.eventClassification.subCategory) {
    case 'Presence':
      retElement = (
        <span>
          {prefix} {data.presence}ed the Chat.
        </span>
      );
      break;

    case 'Message':
      const children = data.messageBuffers?.map(buildMessageChunk).reduce((c: JSX.Element[], chunkChild, idx, arr) => {
        c.push(chunkChild);

        if (idx <= arr.length) {
          c.push(<span> </span>);
        }

        return c;
      }, []);

      retElement = (
        <>
          {prefix} {children!.map((c, key) => React.cloneElement(c, { key }))}
        </>
      );
      break;
    default:
      retElement = <></>;
  }

  return retElement;
}
