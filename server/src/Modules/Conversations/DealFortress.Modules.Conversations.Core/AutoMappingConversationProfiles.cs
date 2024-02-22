using AutoMapper;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO;


namespace Abstractions.Automapper
{
    public class AutoMappingConversationProfiles : Profile
    {
        public AutoMappingConversationProfiles () {
            CreateMap<Conversation, ConversationResponse>();
            CreateMap<ConversationRequest, Conversation>();

            CreateMap<Message, MessageResponse>();
            CreateMap<NestedMessageRequest, Message>();
            CreateMap<StandaloneMessageRequest, Message>();
        }
    }
}