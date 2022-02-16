<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    
    <!-- Trim whitespace -->
    <xsl:strip-space elements="*"/>
    
    <!-- Add root element -->
    <xsl:template match="/">
        <root>
            <xsl:apply-templates/>
        </root>
    </xsl:template>
    
    <!-- Remove header -->
    <xsl:template match="header"/>
    
    <!-- Process stages -->
    <xsl:template match="stage">
        <stage key="{data(./@stageId)}" title="{data(./@stageTitle)}">
            <xsl:apply-templates/>
        </stage>
    </xsl:template>

    <!-- Process moves and retain verse references -->
    <xsl:template match="move">
        <move
            chStart="{data(./@chStart)}"
            vStart="{data(./@vStart)}"
            chEnd="{data(./@chEnd)}"
            vEnd="{data(./@vEnd)}">
            <xsl:apply-templates/>
        </move>
    </xsl:template>
    
    <!-- Process speech acts and track typifying properties -->
    <xsl:template match="m[@feat='speech_act'] | m[@feat='propositional_association']">
        
        <xsl:variable name="directiveness">
            <xsl:choose>
                <xsl:when test="./m/m[@feat='directive'] | ./w/m[@feat='directive']">directive</xsl:when>
                <xsl:when test="./m/m[@feat='!directive'] | ./w/m[@feat='!directive']">!directive</xsl:when>
                <xsl:when test="./m/m[@feat='direction_tbd'] | ./w/m[@feat='direction_tbd']">direction_tbd</xsl:when>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="orientation">
            <xsl:choose>
                <xsl:when test="./m/m/m[@feat='internal_orientation'] | ./w/m/m[@feat='internal_orientation']">internal_orientation</xsl:when>
                <xsl:when test="./m/m/m[@feat='orientation_tbd'] | ./w/m/m[@feat='orientation_tbd']">orientation_tbd</xsl:when>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="contemplation">
            <xsl:choose>
                <xsl:when test="./m/m/m[@feat='contemplative'] | ./w/m/m[@feat='contemplative']">contemplative</xsl:when>
                <xsl:when test="./m/m/m[@feat='contemplation_tbd'] | ./w/m/m[@feat='contemplation_tbd']">assertive</xsl:when>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="tentativeness">
            <xsl:choose>
                <xsl:when test="./m/m[@feat='tentative']">tentative</xsl:when>
                <xsl:when test="./m/m[@feat='!tentative']">!tentative</xsl:when>
                <xsl:when test="./m/m[@feat='tentative_tbd']">tentative_tbd</xsl:when>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="associated">
            <xsl:if test="./@feat='propositional_association'">true</xsl:if>
        </xsl:variable>
            
        <speechAct
            direction="{$directiveness}"
            orientation="{$orientation}"
            contemplation="{$contemplation}"
            tentativeness="{$tentativeness}"
            associated="{$associated}"
            >
            <xsl:apply-templates/>
        </speechAct>
    </xsl:template>
    

    <!-- Reproduce all word text content and lemma -->
    <xsl:template match="e[@type = 'tok']">
        <w gloss="{data(./e/@gloss)}" pos="{data(./e/@pos)}" lemma="{data(./e/@lemma)}">
            <xsl:value-of select="./e//w/text()"/>
        </w>
    </xsl:template>
    
    <!-- Wrap direct discourse -->
    <xsl:template match="m[@feat='semiotic']/m[@feat='expression']/e[@type='speech']">
        
        <xsl:variable name="quotation_marking">
            <xsl:choose>
                <xsl:when test="../m[@feat='quotation_marker']">quotation_marker</xsl:when>
                <xsl:when test="../m[@feat='!quotation_marker']">!quotation_marker</xsl:when>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="speaker_shift">
            <xsl:value-of select="boolean(../m[@feat='speaker_shift_tbd'])"/>
        </xsl:variable>
        
        <xsl:variable name="orientation_shift">
            <xsl:value-of select="boolean(../m[@feat='orientation_shift_tbd'])"/>
        </xsl:variable>
        
        <directDiscourse 
            ostentatious="{data(./@ostentatious)}"
            quotation_marking="{$quotation_marking}"
            speaker_shift="{$speaker_shift}"
            orientation_shift="{$orientation_shift}">
            <xsl:apply-templates/>
        </directDiscourse>
    </xsl:template>

</xsl:stylesheet>
